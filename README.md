# Forms and Fields for React

[![NPM Version](https://img.shields.io/npm/v/forms-and-fields-react)](https://www.npmjs.com/package/forms-and-fields-react)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/rincler/forms-and-fields-react/ci.yml?branch=main)

A React library for field validation and form submission.
This is a wrapper over the [Forms and Fields](https://github.com/rincler/forms-and-fields) library for React.

Field elements are elements like input (of any type), select and textarea. Each field is defined by validation rules — validators.

You can use the `required` validator,
any validator from the [validator](https://www.npmjs.com/package/validator#validators) library (e.g. `isEmail`),
the `FileValidator` or your own custom validators (including AJAX-based validation).

## Usage

**JSX:**
```jsx
import React from "react";
import { SubmissionResult } from "forms-and-fields";
import {
  Form,
  Field,
  useForm
} from "forms-and-fields-react";

function LoginForm() {
  const { formState, getFormOptionsForUpdatingFormState } = useForm();

  const submit = (formData) => {
    const isOk =
      formData.get("email") === "test@example.com" &&
      formData.get("password") === "123456";
    return SubmissionResult.make(isOk, "Incorrect credentials");
  };

  const formOptions = getFormOptionsForUpdatingFormState({
    invalidMessages: {
      required: "This field is required",
      isEmail: "Invalid email"
    }
  });

  return (
    <>
      {!formState.submissionResult?.isPositive() && (
        <Form submit={submit} options={formOptions}>
          <Field validators={["required", "isEmail"]}>
            <div>
              <label htmlFor="email">Email:</label>
              <br />
              <input
                id="email"
                type="text"
                name="email"
                className={formState.fields.email?.status}
              />
              {formState.fields.email?.validationResult?.isInvalid() && (
                <div className="error">
                  {formState.fields.email.validationResult.getMessage()}
                </div>
              )}
            </div>
          </Field>
          <Field validators={["required"]}>
            <div>
              <label htmlFor="password">Password:</label>
              <br />
              <input
                id="password"
                type="password"
                name="password"
                className={formState.fields.password?.status}
              />
              {formState.fields.password?.validationResult?.isInvalid() && (
                <div className="error">
                  {formState.fields.password.validationResult.getMessage()}
                </div>
              )}
            </div>
          </Field>
          <br />
          {formState.submissionResult?.isNegative() && (
            <div className="form-error">
              {formState.submissionResult.getMessage()}
              <br />
              <br />
            </div>
          )}
          <button type="submit">Login</button>
        </Form>
      )}
      {formState.submissionResult?.isPositive() && (
        <div>You are logged in</div>
      )}
    </>
  );
}
```

Or with controlled field elements:

```jsx
  const { formState, getFormOptionsForUpdatingFormState, onChangeHandlerForUpdatingFormState } = useForm();
  // ...
  <input
    id="email"
    type="text"
    name="email"
    className={formState.fields.email?.status}
    value={formState.fields.email?.value || ""}
    onChange={onChangeHandlerForUpdatingFormState}
  />
```

You can experiment with the code above in [CodePen](https://codepen.io/rincler/pen/xbxLxvw).

**More examples:**

Find more examples in the [sandbox](./sandbox).

## Installation

    npm install forms-and-fields forms-and-fields-react

## Documentation

### Common

To validate and submit a form, use the `Form` and `Field` components. To access and manage form state (including field state) use the `useForm` hook.

Form validation involves validating all fields. A form is considered valid when all its fields are valid.

To validate an individual field (outside a form) use the `Field` component with `isStandalone={true}` prop. In this case, to access and manage field state use the `useField` hook.

When a user submits a form, validation is performed first. If the form passes validation, submission is then executed.

### Validation and Submission results

Any custom validator must return a `ValidationResult` object. The internal validators return `ValidationResult` also. See the [ValidationResult class documentation](https://github.com/rincler/forms-and-fields#ValidationResult-class).

A form `submit` function must return a `SubmissionResult` object. See the [SubmissionResult class documentation](https://github.com/rincler/forms-and-fields#SubmissionResult-class).

### Fields

#### `Field` component

Inside the `Field` component, one of the field element (input, select, or textarea) should be present. Field elements must have a `name` attribute. If a field element is not present during initialization and is added dynamically, you must specify the `name` prop for the `Field` component, which must match the name of the field element when it appears in the DOM.
For elements with the same name (e.g., radio buttons or a group of text input elements), use a single `Field` component.

#### `Field` state interface

```typescript
interface FielsState {
  status: string, 
  validationResult: ValidationResult | null,
  value: any,
}
```

#### `Field` component props

| Prop         | Type         | Default                     | Description                                                                               |
|--------------|--------------|-----------------------------|-------------------------------------------------------------------------------------------|
| validators   | `array`      | `[]`                        | See the [Field validators](https://github.com/rincler/forms-and-fields#field-validators). |
| options      | `object`     | `{cssStatusEnabled: false}` | See the [Field options](https://github.com/rincler/forms-and-fields#field-options).       |
| isStandalone | `boolean`    | `false`                     | Specifies whether the field is outside a form.                                            |
| name         | `string`     | `undefined`                 | A name of the field element.                                                              |
| fieldState   | `FielsState` | `undefined`                 | Field state. It is required if you use an initial state or the `setFieldState` function.  |

**Important!** To update the component state inside field callback options, use an updater function:

Right: 
```JS
setState(state => {
  ...state,
  ...newState  
});
```

Wrong:
```JS
setState({
  ...state,
  ...newState
});
```

#### `useField` hook

This hook is used to access and manage the field state. If you pass an initial state, don't forget to pass it to the `Field` component. It returns an object with the following keys: 

| Key                                  | Type         | Description                                                                                                                                                                                                                                                                                      |
|--------------------------------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fieldState                           | `FielsState` | The current state of the field.                                                                                                                                                                                                                                                                  |
| setFieldState                        | `function`   | The function that allows you to update the field state. Arguments: `fieldState: FieldState`. Don't forget to pass `fieldState` to the `Field` component if you use this function.                                                                                                                |
| getFieldOptionsForUpdatingFieldState | `function`   | The function that returns the options you need to pass to the `Field` component for updates to the current state of the field. Arguments: `fieldOptions: object = {}` - your options.                                                                                                            |
| onChangeHandlerForUpdatingFieldState | `function`   | The `onChange` handler for field elements that updates the field value in state. When you specify the `value` attribute (for controlled elements), React requires you to specify the `onChange` attribute. The `onChangeHandlerForUpdatingFieldState` function is specifically for this purpose. |

### Forms

#### `Form` component

Extends `HTMLFormElement`. The `submit` prop is expected instead of the `onSubmit` attribute.

#### `Form` state interface

```typescript
interface FormState {
  status: string,
  validationResult: ValidationResult;
  submissionResult: SubmissionResult | null;
  fields: { [fieldName: string]: FieldState },
}
```

#### `Form` component props

| Prop      | Type        | Default                     | Description                                                                                              |
|-----------|-------------|-----------------------------|----------------------------------------------------------------------------------------------------------|
| submit    | `function`  |                             | A submit function, (a `FormData` object is passed as argument, must return a `SubmissionResult` object). |
| options   | `object`    | `{cssStatusEnabled: false}` | See the [Form options](https://github.com/rincler/forms-and-fields#form-options).                        |
| formState | `FormState` | `undefined`                 | Form state. It is required if you use an initial state, the `setFormState` or `setFieldState` functions. |

**Important!** To update the component state inside form callback options, use an updater function:

Right:
```JS
setState(state => {
  ...state,
  ...newState  
});
```

Wrong:
```JS
setState({
  ...state,
  ...newState
});
```

#### `useForm` hook

This hook is used to access and manage the form state. If you pass an initial state, don't forget to pass it to the `Form` component. It returns an object with the following keys: 

| Key                                 | Type        | Description                                                                                                                                                                                                                                                                                     |
|-------------------------------------|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| formState                           | `FormState` | The current state of the form.                                                                                                                                                                                                                                                                  |
| visualStatus                        | `string`    | `FormStatus.Invalid` if at least one field in the form state has the invalid status, otherwise the form status. Unlike the form status, it takes into account fields validated separately (e.g. on typing). Use it, for example, to disable the submit button.                                |
| setFormState                        | `function`  | The function that allows you to update the form state. Arguments: `formState: FormState`. Don't forget to pass `formState` to the `Form` component if you use this function.                                                                                                                    |
| setFieldState                       | `function`  | The function that allows you to update the field state in the form state. Arguments: `stateFieldKey: string, fieldState: FieldState`. Don't forget to pass `formState` to the `Form` component if you use this function.                                                                        |
| getFormOptionsForUpdatingFormState  | `function`  | The function that returns the options you need to pass to the `Form` component for updates to the current state of the form. Arguments: `formOptions: object = {}` - your options.                                                                                                              |
| onChangeHandlerForUpdatingFormState | `function`  | The `onChange` handler for field elements that updates the field value in state. When you specify the `value` attribute (for controlled elements), React requires you to specify the `onChange` attribute. The `onChangeHandlerForUpdatingFormState` function is specifically for this purpose. |
| group                               | `object`    | Helper methods (`get(fieldName: string)`, `add(fieldName: string)`, `delete(stateFieldKey: string)` to access and manage the state of a group of field elements (field elements with the same name). See the details [here](#groups).                                                           |

**Important!** When a `Field` component is removed from JSX (e.g. by a condition), its state stays in the form state. So `visualStatus` still takes it into account, your code that reads `formState.fields` still sees it, and when the field is shown again, it gets the previous status and validation result. To avoid this, reset the field state when you hide the field:

```tsx
import { FieldStatus } from "forms-and-fields";

setFieldState("phone", {
  status: FieldStatus.No,
  validationResult: null,
  value: formState.fields.phone?.value,
});
```

For a group, reset the state of each group field (keys from `group.get()`) or delete them via `group.delete()`.

### Validation of files

See the [Validation of files](https://github.com/rincler/forms-and-fields#validation-of-files)

Example:

```tsx
<Field validators={[new new FileValidator({ maxSize: 536870912, allowedMimeTypes: ['image/jpg'] }, { maxSize: 'The size of {file} must be less than {maxSizeInMiB} MiB.' })]}>
  <input type="file" name="upload" />
</Field>
```

### Radio buttons

Use a single `Field` component for radio buttons with the same name:

Example:

```tsx
<Field validators={["required"]}>
  <input id="sex-man" type="radio" name="sex" class="js-sex" value="man" />
  <label for="sex-man">Man</label>
  <input id="sex-woman" type="radio" name="sex" class="js-sex" value="woman" />
  <label for="sex-woman">Woman</label>
</Field>
```

### Groups

Sometimes it's necessary to add fields with the same name, for example, a group of addresses. In this case, use the `data-group-field` attribute and a single `Field` object.

If you use form state or have a dynamic group that requires state, use the helper methods from the `group` object, which you can get from the `useForm` hook.

| Method                          | Description                                                                                        |
|---------------------------------|----------------------------------------------------------------------------------------------------|
| get(fieldName: `string`)        | Returns an array of "field key" - "field state" pairs extracted from the form state.               |
| add(fieldName: `string`)        | Adds a new field state to the form state with a generated field key in the format: `fieldName:id`. |
| delete(stateFieldKey: `string`) | Deletes the field from the form state by the given key.                                            |

Field keys must be in the following format: `fieldName:id`, so keep it in mind if you want to initialize a group via `useForm()`.

You must set the `key` attribute for each list item (to keep list items in order - https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key) and the `data-key` for each field element. 
Get this key via the `group.get()` method.

Find an example in the [sandbox/EmailGroupForm.jsx](./sandbox/src/EmailGroupForm.jsx).

**Important!** Don't use any of the above for radio buttons.

**Important!** Standalone `Field` components (outside a form) don't support groups.

### Statuses

The statuses of forms and fields change during validation and submission. You can get the form and field statuses via form or field state.

List of statuses:

- `FieldStatus.Validating` (`"ff-field-validating"`)
- `FieldStatus.Valid` (`"ff-field-valid"`)
- `FieldStatus.Invalid` (`"ff-field-invalid"`)
- `FormStatus.Validating` (`"ff-form-validating"`)
- `FormStatus.Valid` (`"ff-form-valid"`)
- `FormStatus.Invalid` (`"ff-form-invalid"`)
- `FormStatus.Submitting` (`"ff-form-submitting"`)
- `FormStatus.PositiveSubmit` (`"ff-form-positive-submit"`)
- `FormStatus.NegativeSubmit` (`"ff-form-negative-submit"`)

## License

This library is released under the [MIT license](./LICENSE).


