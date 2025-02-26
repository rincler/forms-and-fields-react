import Field from "../../src/Field";
import Form from "../../src/Form";
import React from "react";
import { FieldStatus, SubmissionResult, ValidationResult } from "forms-and-fields";
import defaultFormOptions from "./defaultFormOptions";

const submit = () => SubmissionResult.positive();

const RegistrationFormFullUncontrolled = () => {
  const formOptions = {
    ...defaultFormOptions,
    cssStatusEnabled: true,
    onFieldStatusChange: (status, validationResult, fieldElement) => {
      if (status === FieldStatus.Invalid) {
        fieldElement.insertAdjacentHTML(
          "afterend",
          `<div class="error">${validationResult.getMessage()}</div>`,
        );
      } else {
        fieldElement.parentNode?.querySelector(".error")?.remove();
      }
    },
  };

  return (
    <Form submit={submit} options={formOptions}>
      <Field validators={["required", "isEmail"]}>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input id="email" type="text" name="email" />
        </div>
      </Field>
      <Field validators={["required"]}>
        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input id="password" type="password" name="password" />
        </div>
      </Field>
      <Field
        validators={[
          "required",
          (value) => {
            const password = document.querySelector("#password").value;
            return ValidationResult.make(value === password, "Passwords do not match");
          },
        ]}
        options={{
          validationCacheEnabled: false,
        }}
      >
        <div>
          <label htmlFor="confirm_password">Confirm Password:</label>
          <br />
          <input id="confirm_password" type="password" name="confirm_password" />
        </div>
      </Field>
      <br />
      <button type="submit">Register</button>
    </Form>
  );
};

export default RegistrationFormFullUncontrolled;
