import { Field as FieldClass, FieldElement, FieldOptions, FieldStatus } from "forms-and-fields";
import { ChangeEvent, useState } from "react";
import { FieldState } from "./types";

const useField = ({
  status = FieldStatus.No,
  validationResult = null,
  value,
}: Partial<FieldState> = {}) => {
  const [fieldState, setFieldState] = useState<FieldState>({
    status,
    validationResult,
    value,
  });

  const fieldOptionsForUpdatingFieldState: FieldOptions = {
    onStatusChange: (status, validationResult) => {
      setFieldState((fieldState) => ({
        ...fieldState,
        status,
        validationResult,
      }));
    },
    onChange: (fieldValue) => {
      setFieldState((fieldState) => ({
        ...fieldState,
        value: fieldValue,
      }));
    },
  };

  const getFieldOptionsForUpdatingFieldState = (fieldOptions: FieldOptions = {}): FieldOptions => ({
    ...fieldOptions,
    onStatusChange: fieldOptions.onStatusChange
      ? (...args) => {
          fieldOptionsForUpdatingFieldState.onStatusChange!(...args);
          fieldOptions.onStatusChange!(...args);
        }
      : fieldOptionsForUpdatingFieldState.onStatusChange,
    onChange: fieldOptions.onChange
      ? (...args) => {
          fieldOptionsForUpdatingFieldState.onChange!(...args);
          fieldOptions.onChange!(...args);
        }
      : fieldOptionsForUpdatingFieldState.onChange,
  });

  const onChangeHandlerForUpdatingFieldState = (event: ChangeEvent<FieldElement>) => {
    const fieldElement = event.target;
    const fieldSelector = `[name="${fieldElement.name}"]`;
    const containerElement = fieldElement.closest<HTMLElement>("[data-container-id]");
    const field = new FieldClass(
      fieldSelector,
      `[data-container-id="${containerElement!.dataset.containerId}"]`,
    );
    setFieldState((fieldState) => ({
      ...fieldState,
      value: field.getValue(),
    }));
  };

  return {
    fieldState,
    setFieldState,
    getFieldOptionsForUpdatingFieldState,
    onChangeHandlerForUpdatingFieldState,
  };
};

export default useField;
