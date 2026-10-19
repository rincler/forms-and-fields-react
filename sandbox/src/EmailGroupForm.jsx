import { FieldStatus, SubmissionResult } from "../../src";
import Form from "../../src/Form";
import Field from "../../src/Field";
import React from "react";
import useForm from "../../src/useForm";
import defaultFormOptions from "./defaultFormOptions";

const EmailGroupForm = () => {
  const { getFormOptionsForUpdatingFormState, group } = useForm({
    fields: {
      "email:0": {
        status: FieldStatus.No,
        validationResult: null,
      },
    },
  });

  const submit = () => SubmissionResult.positive();

  const renderEmailGroup = () => {
    const rendered = [];
    let number = 0;
    for (const [key, fieldState] of group.get("email")) {
      number++;
      rendered.push(
        <div key={key}>
          <label htmlFor={key}>Email #{number}:</label>
          <br />
          <div className="line">
            <div>
              <input id={key} type="text" name="email" data-group-field="" data-key={key} />
              {fieldState.validationResult?.isInvalid() && (
                <div className="error">{fieldState.validationResult.getMessage()}</div>
              )}
            </div>
            {group.get("email").length > 1 && (
              <button onClick={() => group.delete(key)} type="button">
                -
              </button>
            )}
          </div>
        </div>,
      );
    }

    return rendered;
  };

  return (
    <Form
      submit={submit}
      options={getFormOptionsForUpdatingFormState({
        ...defaultFormOptions,
        cssStatusEnabled: true,
      })}
    >
      <Field validators={["required", "isEmail"]} name="email">
        {renderEmailGroup()}
      </Field>
      <br />
      <button onClick={() => group.add("email")} type="button">
        +
      </button>
      <br />
      <br />
      <button type="submit">Submit</button>
    </Form>
  );
};

export default EmailGroupForm;
