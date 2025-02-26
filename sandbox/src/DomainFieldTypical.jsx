import React from "react";
import Field from "../../src/Field";
import defaultFieldOptions from "./defaultFieldOptions";
import useField from "../../src/useField";

const DomainFieldTypical = () => {
  const { fieldState, getFieldOptionsForUpdatingFieldState } = useField();

  return (
    <Field
      validators={["required", "isFQDN"]}
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

export default DomainFieldTypical;
