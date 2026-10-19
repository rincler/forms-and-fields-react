import Field from "../../src/Field";
import Form from "../../src/Form";
import React, { useState } from "react";
import { SubmissionResult, ValidationResult } from "../../src";
import defaultFormOptions from "./defaultFormOptions";
import useForm from "../../src/useForm";

const fetchOk = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(
      `The request "${input}" returned with an HTTP status code: ${response.status}.`,
    );
  }
  return response;
};

const checkEmail = async (value) => {
  const response = await fetchOk(`/check-email?email=${encodeURIComponent(value)}`);
  const result = await response.json();

  return ValidationResult.make(result.isValid, "The email must end with example.com");
};

const mapResponseTypeToUrl = (value) => {
  if (value === "positive") {
    return "/positive-response";
  }

  if (value === "invalid") {
    return "/invalid-response";
  }

  if (value === "negative") {
    return "/negative-response";
  }

  if (value === "http-error") {
    return "/response-with-http-error";
  }

  throw new Error("Invalid argument.");
};

const submit = async (formData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const url = mapResponseTypeToUrl(formData.get("response"));

  const response = await fetchOk(url, {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const result = await response.json();

  if (!result.isSuccess && result.invalid) {
    return SubmissionResult.invalid(result.invalid);
  }

  return SubmissionResult.make(result.isSuccess, "Can't register.");
};

const RegistrationFormExtended = () => {
  const { formState, getFormOptionsForUpdatingFormState } = useForm();
  const [httpError, setHttpError] = useState("");

  const formOptions = getFormOptionsForUpdatingFormState({
    ...defaultFormOptions,
    cssStatusEnabled: true,
    onSubmissionError: (error) => {
      setHttpError(error.toString());
      setTimeout(() => {
        setHttpError("");
      }, 3000);
    },
  });

  return (
    <>
      {httpError && (
        <div className="form-error">
          {httpError}
          <br />
          <br />
        </div>
      )}
      {!formState.submissionResult?.isPositive() && (
        <Form submit={submit} options={formOptions}>
          <Field validators={["required", "isEmail", checkEmail]}>
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
                <div className="error">
                  {formState.fields.password.validationResult.getMessage()}
                </div>
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
              <input id="confirm_password" type="password" name="confirm_password" />
              {formState.fields.confirm_password?.validationResult?.isInvalid() && (
                <div className="error">
                  {formState.fields.confirm_password.validationResult.getMessage()}
                </div>
              )}
            </div>
          </Field>
          <Field>
            <div>
              <input
                id="response-positive"
                type="radio"
                name="response"
                value="positive"
                defaultChecked
              />
              <label htmlFor="response-positive">Positive response</label>
              <br />
              <input id="response-invalid" type="radio" name="response" value="invalid" />
              <label htmlFor="response-invalid">Invalid response</label>
              <br />
              <input id="response-negative" type="radio" name="response" value="negative" />
              <label htmlFor="response-negative">Negative response</label>
              <br />
              <input id="response-http-error" type="radio" name="response" value="http-error" />
              <label htmlFor="response-http-error">Response with HTTP-error</label>
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
          <button type="submit">Register</button>
        </Form>
      )}
      {formState.submissionResult?.isPositive() && <div>You have successfully registered.</div>}
    </>
  );
};

export default RegistrationFormExtended;
