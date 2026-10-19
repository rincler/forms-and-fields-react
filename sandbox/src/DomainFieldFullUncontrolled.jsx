import React from "react";
import Field from "../../src/Field";
import defaultFieldOptions from "./defaultFieldOptions";
import { FieldStatus } from "../../src";

const DomainFieldFullUncontrolled = () => {
  const fieldOptions = {
    ...defaultFieldOptions,
    cssStatusEnabled: true,
    onStatusChange: (status, validationResult, fieldElement) => {
      if (status === FieldStatus.Invalid) {
        fieldElement.insertAdjacentHTML(
          "afterend",
          `<div class="error">${validationResult.getMessage()}</div>`,
        );
      } else {
        fieldElement.parentNode?.querySelector(".error")?.remove();
      }
    },
    validateOnType: true,
  };

  return (
    <Field validators={["required", "isFQDN"]} options={fieldOptions} isStandalone={true}>
      <label htmlFor="domain">Domain:</label>
      <br />
      <input id="domain" type="text" name="domain" />
    </Field>
  );
};

export default DomainFieldFullUncontrolled;
