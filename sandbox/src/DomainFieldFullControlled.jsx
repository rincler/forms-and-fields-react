import React from "react";
import Field from "../../src/Field";
import defaultFieldOptions from "./defaultFieldOptions";
import useField from "../../src/useField";

const DomainFieldFullControlled = () => {
  const { fieldState, getFieldOptionsForUpdatingFieldState, onChangeHandlerForUpdatingFieldState } =
    useField();

  return (
    <Field
      validators={["required", "isFQDN"]}
      options={getFieldOptionsForUpdatingFieldState({
        ...defaultFieldOptions,
        validateOnType: true,
      })}
      isStandalone={true}
    >
      <label htmlFor="domain">Domain:</label>
      <br />
      <input
        id="domain"
        type="text"
        name="domain"
        className={fieldState.status}
        value={fieldState.value || ""}
        onChange={onChangeHandlerForUpdatingFieldState}
      />
      {fieldState.validationResult?.isInvalid() && (
        <div className="error">{fieldState.validationResult.getMessage()}</div>
      )}
    </Field>
  );
};

export default DomainFieldFullControlled;
