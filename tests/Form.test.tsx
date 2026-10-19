import * as React from "react";
import { FC, PropsWithChildren, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import Field from "../src/Field";
import "@testing-library/jest-dom";
import {
  FieldStatus,
  FormOptions,
  FormStatus,
  SubmissionResult,
  SubmitFn,
  ValidateFn,
  ValidationResult,
} from "forms-and-fields";
import { FormState } from "../src";
import useForm from "../src/useForm";
import Form from "../src/Form";

interface ComponentProps {
  expectedStateWhenValidating?: number;
  expectedStateWhenSubmitting?: number;
  initialFormState?: FormState;
}

const Component: FC<PropsWithChildren<ComponentProps>> = ({
  expectedStateWhenValidating,
  expectedStateWhenSubmitting,
  initialFormState,
}) => {
  const {
    formState,
    visualStatus,
    getFormOptionsForUpdatingFormState,
    onChangeHandlerForUpdatingFormState,
    group,
  } = useForm(initialFormState);
  const [state, setState] = useState(1);

  const validator: ValidateFn = () => {
    expect(state).toBe(expectedStateWhenValidating);
    return ValidationResult.valid();
  };

  const submit: SubmitFn = () => {
    expect(state).toBe(expectedStateWhenSubmitting);
    return SubmissionResult.positive();
  };

  const formOptions: FormOptions = {
    onBeforeValidateField: () => {
      expect(state).toBe(expectedStateWhenValidating);
    },
  };

  const renderAddressGroup = () => {
    const rendered = [];
    let number = 0;
    for (const [key, fieldState] of group.get("address")) {
      number++;
      rendered.push(
        <div key={key}>
          <label htmlFor={key}>Address #{number}</label>
          <br />
          <div className="line">
            <div>
              <input id={key} type="text" name="address" data-group-field="" data-key={key} />
              {fieldState.validationResult?.isInvalid() && (
                <div className="error">{fieldState.validationResult.getMessage()}</div>
              )}
            </div>
            {group.get("address").length > 1 && (
              <button onClick={() => group.delete(key)} type="button">
                Delete address
              </button>
            )}
          </div>
        </div>,
      );
    }

    return rendered;
  };

  return (
    <>
      <Form
        submit={submit}
        options={getFormOptionsForUpdatingFormState(formOptions)}
        formState={formState}
      >
        <Field validators={["required", "isEmail", validator]}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              name="email"
              className={formState.fields.email?.status}
              value={(formState.fields.email?.value as string) || ""}
              onChange={onChangeHandlerForUpdatingFormState}
            />
            {formState.fields.email?.validationResult?.isInvalid() && (
              <div className="error">{formState.fields.email.validationResult.getMessage()}</div>
            )}
          </div>
        </Field>
        <Field validators={["required", validator]} name="address">
          {renderAddressGroup()}
          <button onClick={() => group.add("address")} type="button">
            Add address
          </button>
        </Field>
        <button type="submit">Submit</button>
      </Form>
      {formState.submissionResult?.isPositive() && <div>Form successfully submitted</div>}
      <div data-testid="visual-status">{visualStatus}</div>
      <button type="button" onClick={() => setState(state + 1)}>
        Update state
      </button>
    </>
  );
};

describe("Form", () => {
  test("submits valid value", async () => {
    render(<Component expectedStateWhenValidating={2} expectedStateWhenSubmitting={2} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });

      await fireEvent.click(screen.getByText("Submit"));
    });

    expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("test@example.com");
    expect(screen.queryByText("Invalid value.")).not.toBeInTheDocument();
    expect(screen.getByText("Form successfully submitted")).toBeInTheDocument();
    expect(screen.getByTestId("visual-status")).toHaveTextContent(FormStatus.PositiveSubmit);
  });

  test("submits invalid value", async () => {
    render(<Component expectedStateWhenValidating={2} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "@example.com" },
      });

      await fireEvent.click(screen.getByText("Submit"));
    });

    expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("@example.com");
    expect(screen.getByText("Invalid value.")).toBeInTheDocument();
    expect(screen.queryByText("Form successfully submitted")).not.toBeInTheDocument();
    expect(screen.getByTestId("visual-status")).toHaveTextContent(FormStatus.Invalid);
  });

  test("uses validation cache (initial form state is passed)", async () => {
    const initialFormState: FormState = {
      status: FormStatus.Valid,
      validationResult: ValidationResult.valid(),
      submissionResult: null,
      fields: {
        email: {
          value: "test@example.com",
          status: FieldStatus.Valid,
          validationResult: ValidationResult.valid(),
        },
      },
    };

    render(<Component expectedStateWhenSubmitting={2} initialFormState={initialFormState} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.click(screen.getByText("Submit"));
    });
  });
});

describe("Form with group", () => {
  test("submits valid value", async () => {
    render(<Component expectedStateWhenValidating={2} expectedStateWhenSubmitting={2} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.click(screen.getByText("Add address"));
      await fireEvent.click(screen.getByText("Add address"));
      await fireEvent.click(screen.getByText("Add address"));

      await fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      await fireEvent.change(screen.getByLabelText("Address #1"), {
        target: { value: "Metropolis" },
      });
      await fireEvent.change(screen.getByLabelText("Address #2"), {
        target: { value: "Gotham City" },
      });
      await fireEvent.change(screen.getByLabelText("Address #3"), {
        target: { value: "Starling City" },
      });

      await fireEvent.click(screen.getAllByText("Delete address")[0]);

      await fireEvent.click(screen.getByText("Submit"));
    });

    expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("test@example.com");
    expect(screen.queryByDisplayValue("Metropolis")).not.toBeInTheDocument();
    expect(screen.getByLabelText<HTMLInputElement>("Address #1").value).toBe("Gotham City");
    expect(screen.getByLabelText<HTMLInputElement>("Address #2").value).toBe("Starling City");
    expect(screen.queryByText("Invalid value.")).not.toBeInTheDocument();
    expect(screen.queryByText("Form successfully submitted")).toBeInTheDocument();
  });

  test("submits invalid value", async () => {
    render(<Component expectedStateWhenValidating={2} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.click(screen.getByText("Add address"));
      await fireEvent.click(screen.getByText("Add address"));
      await fireEvent.click(screen.getByText("Add address"));
      await fireEvent.click(screen.getByText("Add address"));
      await fireEvent.click(screen.getByText("Add address"));

      await fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
      await fireEvent.change(screen.getByLabelText("Address #2"), {
        target: { value: "Gotham City" },
      });
      await fireEvent.change(screen.getByLabelText("Address #5"), {
        target: { value: "Starling City" },
      });

      await fireEvent.click(screen.getAllByText("Delete address")[0]);

      await fireEvent.click(screen.getByText("Submit"));
    });

    expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("test@example.com");
    expect(screen.queryByDisplayValue("Metropolis")).not.toBeInTheDocument();
    expect(screen.getByLabelText<HTMLInputElement>("Address #1").value).toBe("Gotham City");
    expect(screen.getByLabelText<HTMLInputElement>("Address #2").value).toBe("");
    expect(screen.getByLabelText<HTMLInputElement>("Address #3").value).toBe("");
    expect(screen.getByLabelText<HTMLInputElement>("Address #4").value).toBe("Starling City");
    expect(screen.getAllByText("Invalid value.").length).toBe(2);
    expect(screen.queryByText("Form successfully submitted")).not.toBeInTheDocument();
  });

  test("uses validation cache (initial form state is passed)", async () => {
    const initialFormState: FormState = {
      status: FormStatus.Valid,
      validationResult: ValidationResult.valid(),
      submissionResult: null,
      fields: {
        email: {
          value: "test@example.com",
          status: FieldStatus.Valid,
          validationResult: ValidationResult.valid(),
        },
        "address:0": {
          value: "Gotham City",
          status: FieldStatus.Valid,
          validationResult: ValidationResult.valid(),
        },
      },
    };

    render(<Component expectedStateWhenSubmitting={2} initialFormState={initialFormState} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.click(screen.getByText("Submit"));
    });
  });
});
