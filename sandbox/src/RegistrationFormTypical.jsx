import Field from "../../src/Field";
import Form from "../../src/Form";
import React from "react";
import { SubmissionResult } from "../../src";
import defaultFormOptions from "./defaultFormOptions";
import useForm from "../../src/useForm";

const submit = () => SubmissionResult.positive();

const RegistrationFormTypical = () => {
  const { formState, getFormOptionsForUpdatingFormState } = useForm();

  return (
    <Form
      submit={submit}
      options={getFormOptionsForUpdatingFormState({
        ...defaultFormOptions,
        cssStatusEnabled: true,
      })}
    >
      <Field validators={["required", "isEmail"]}>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input id="email" type="text" name="email" />
          {formState.fields.email?.validationResult?.isInvalid() && (
            <div className="error">{formState.fields.email.validationResult.getMessage()}</div>
          )}
        </div>
      </Field>
      <Field validators={["required"]}>
        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input id="password" type="password" name="password" />
          {formState.fields.password?.validationResult?.isInvalid() && (
            <div className="error">{formState.fields.password.validationResult.getMessage()}</div>
          )}
        </div>
      </Field>
      <Field
        validators={["required", "equals"]}
        options={{
          ...defaultFormOptions,
          invalidMessages: {
            ...defaultFormOptions.invalidMessages,
            equals: "Passwords do not match",
          },
          validationCacheEnabled: false,
          validatorParams: { equals: [formState.fields.password?.value] },
        }}
      >
        <div>
          <label htmlFor="confirm_password">Confirm Password:</label>
          <br />
          <input id="confirm_password" type="password" name="confirm_password" />
          {formState.fields.confirm_password?.validationResult?.isInvalid() && (
            <div className="error">
              {formState.fields.confirm_password.validationResult.getMessage()}
            </div>
          )}
        </div>
      </Field>
      <br />
      <button type="submit">Register</button>
    </Form>
  );
};

export default RegistrationFormTypical;
