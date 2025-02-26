import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Field from "../src/Field";
import "@testing-library/jest-dom";
import useField from "../src/useField";
import { FC, PropsWithChildren, useState } from "react";
import { FieldOptions, FieldStatus, ValidateFn, ValidationResult } from "forms-and-fields";
import { FieldState } from "../src";

interface ComponentProps {
  expectedStateWhenValidating?: number;
  initialFieldState?: FieldState;
}

const Component: FC<PropsWithChildren<ComponentProps>> = ({
  expectedStateWhenValidating,
  initialFieldState,
}) => {
  const { fieldState, getFieldOptionsForUpdatingFieldState, onChangeHandlerForUpdatingFieldState } =
    useField(initialFieldState);
  const [state, setState] = useState(1);

  const validator: ValidateFn = () => {
    expect(state).toBe(expectedStateWhenValidating);
    return ValidationResult.valid();
  };

  const fieldOptions: FieldOptions = {
    onBeforeValidate: () => {
      expect(state).toBe(expectedStateWhenValidating);
    },
    validateOnChange: true,
  };

  return (
    <>
      <Field
        validators={["required", "isEmail", validator]}
        options={getFieldOptionsForUpdatingFieldState(fieldOptions)}
        isStandalone={true}
        fieldState={fieldState}
      >
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            className={fieldState.status}
            value={(fieldState.value as string) || ""}
            onChange={onChangeHandlerForUpdatingFieldState}
          />
          {fieldState.validationResult?.isInvalid() && (
            <div className="error">{fieldState.validationResult.getMessage()}</div>
          )}
        </div>
      </Field>
      <button type="button" onClick={() => setState(state + 1)}>
        Update state
      </button>
    </>
  );
};

describe("Field", () => {
  test("validates valid value", async () => {
    render(<Component expectedStateWhenValidating={2} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test@example.com" },
      });
    });

    expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("test@example.com");
    expect(screen.queryByText("Invalid value.")).not.toBeInTheDocument();
  });

  test("validates invalid value", async () => {
    render(<Component expectedStateWhenValidating={2} />);

    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "@example.com" },
      });
    });

    expect(screen.getByLabelText<HTMLInputElement>("Email").value).toBe("@example.com");
    expect(screen.getByText("Invalid value.")).toBeInTheDocument();
  });

  test("uses validation cache (initial field state is passed)", async () => {
    const initialFieldState: FieldState = {
      value: "test@example.com",
      status: FieldStatus.Valid,
      validationResult: ValidationResult.valid(),
    };

    render(<Component initialFieldState={initialFieldState} />);

    // In a real case, the "keyUp" event occurs first, resetting the state and triggering validation on change.
    // However, in this test, we only simulate the "onChange" event, which immediately triggers field validation.
    await act(async () => {
      await fireEvent.click(screen.getByText("Update state"));

      await fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "test2@example.com" },
      });
    });
  });
});
