import Field from "../../src/Field";
import Form from "../../src/Form";
import React from "react";
import { SubmissionResult } from "../../src";
import defaultFormOptions from "./defaultFormOptions";
import useForm from "../../src/useForm";

const submit = () => SubmissionResult.positive();

const RegistrationFormFullControlled = () => {
  const { formState, getFormOptionsForUpdatingFormState, onChangeHandlerForUpdatingFormState } =
    useForm();

  return (
    <Form
      submit={submit}
      options={getFormOptionsForUpdatingFormState(defaultFormOptions)}
      className={formState.status}
    >
      <Field validators={["required", "isEmail"]}>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="text"
            name="email"
            className={formState.fields.email?.status}
            value={formState.fields.email?.value || ""}
            onChange={onChangeHandlerForUpdatingFormState}
          />
          {formState.fields.email?.validationResult?.isInvalid() && (
            <div className="error">{formState.fields.email.validationResult.getMessage()}</div>
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
            value={formState.fields.password?.value || ""}
            onChange={onChangeHandlerForUpdatingFormState}
          />
          {formState.fields.password?.validationResult?.isInvalid() && (
            <div className="error">{formState.fields.password.validationResult.getMessage()}</div>
          )}
        </div>
      </Field>
      <Field
        validators={["required", "equals"]}
        options={{
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
          <input
            id="confirm_password"
            type="password"
            name="confirm_password"
            className={formState.fields.confirm_password?.status}
            value={formState.fields.confirm_password?.value || ""}
            onChange={onChangeHandlerForUpdatingFormState}
          />
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

export default RegistrationFormFullControlled;
