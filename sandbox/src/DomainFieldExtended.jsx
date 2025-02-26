import React from "react";
import Field from "../../src/Field";
import defaultFieldOptions from "./defaultFieldOptions";
import { ValidationResult } from "forms-and-fields";
import useField from "../../src/useField";

const fetchOk = async (input, init) => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(
      `The request "${input}" returned with an HTTP status code: ${response.status}.`,
    );
  }
  return response;
};

const checkDomain = async (value) => {
  const response = await fetchOk(`/check-domain?domain=${encodeURIComponent(value)}`);
  const result = await response.json();

  return ValidationResult.make(result.isValid, "The domain must be in the .com zone.");
};

const DomainFieldExtended = () => {
  const { fieldState, getFieldOptionsForUpdatingFieldState } = useField();

  return (
    <Field
      validators={["required", "isFQDN", checkDomain]}
      options={getFieldOptionsForUpdatingFieldState({
        ...defaultFieldOptions,
        cssStatusEnabled: true,
        validateOnType: true,
      })}
      isStandalone={true}
    >
      <label htmlFor="domain">Domain:</label>
      <br />
      <input id="domain" type="text" name="domain" />
      {fieldState.validationResult?.isInvalid() && (
        <div className="error">{fieldState.validationResult.getMessage()}</div>
      )}
    </Field>
  );
};

export default DomainFieldExtended;
