import {
  Field as FieldClass,
  FieldElement,
  FieldStatus,
  FormOptions,
  FormStatus,
} from "forms-and-fields";
import React, { useState } from "react";
import { FieldState, FormState } from "./types";

const DEFAULT_FIELD_STATE: FieldState = {
  status: FieldStatus.No,
  validationResult: null,
};

const key = (fieldName: string, id: string) => {
  return `${fieldName}:${id}`;
};

export const getGroupFromState = (fieldName: string, formState: FormState) => {
  const prefix = `${fieldName}:`;
  return Object.entries(formState.fields).filter(([key]) => key.startsWith(prefix));
};

const useForm = ({
  status = FormStatus.No,
  validationResult = null,
  submissionResult = null,
  fields = {},
}: Partial<FormState> = {}) => {
  const [formState, setFormState] = useState<FormState>({
    status,
    validationResult,
    submissionResult,
    fields,
  });

  const setFieldState = (stateFieldKey: string, fieldState: FieldState) => {
    setFormState((formState) => ({
      ...formState,
      fields: {
        ...formState.fields,
        [stateFieldKey]: fieldState,
      },
    }));
  };

  const updateFieldState = (stateFieldKey: string, fieldState: Partial<FieldState>) => {
    setFormState((formState) => ({
      ...formState,
      fields: {
        ...formState.fields,
        [stateFieldKey]: {
          ...DEFAULT_FIELD_STATE,
          ...formState.fields[stateFieldKey],
          ...fieldState,
        },
      },
    }));
  };

  const getFieldElementKey = (fieldElement: FieldElement) => {
    return fieldElement.dataset.key || fieldElement.name;
  };

  const formOptionsForUpdatingFormState: FormOptions = {
    onStatusChange: (status, validationResult, submissionResult) => {
      setFormState((formState) => ({
        ...formState,
        status,
        validationResult: validationResult ? validationResult["*"] : null,
        submissionResult,
      }));
    },
    onFieldStatusChange: (status, validationResult, fieldElement) => {
      updateFieldState(getFieldElementKey(fieldElement), { status, validationResult });
    },
    onChange: (fieldValue, fieldElement) => {
      updateFieldState(getFieldElementKey(fieldElement), { value: fieldValue });
    },
  };

  const getFormOptionsForUpdatingFormState = (formOptions: FormOptions = {}): FormOptions => ({
    ...formOptions,
    onStatusChange: formOptions.onStatusChange
      ? (...args) => {
          formOptionsForUpdatingFormState.onStatusChange!(...args);
          formOptions.onStatusChange!(...args);
        }
      : formOptionsForUpdatingFormState.onStatusChange,
    onFieldStatusChange: formOptions.onFieldStatusChange
      ? (...args) => {
          formOptionsForUpdatingFormState.onFieldStatusChange!(...args);
          formOptions.onFieldStatusChange!(...args);
        }
      : formOptionsForUpdatingFormState.onFieldStatusChange,
    onChange: formOptions.onChange
      ? (...args) => {
          formOptionsForUpdatingFormState.onChange!(...args);
          formOptions.onChange!(...args);
        }
      : formOptionsForUpdatingFormState.onChange,
  });

  const onChangeHandlerForUpdatingFormState = (event: React.ChangeEvent<FieldElement>) => {
    const fieldElement = event.target;
    const containerElement = fieldElement.closest<HTMLFormElement>("[data-form-id]");
    const fieldSelector = fieldElement.dataset.groupField
      ? `[data-group-field="${fieldElement.dataset.groupField}"]`
      : `[name="${fieldElement.name}"]`;
    const field = new FieldClass(
      fieldSelector,
      `[data-form-id="${containerElement!.dataset.formId}"]`,
    );

    updateFieldState(getFieldElementKey(fieldElement), { value: field.getValue() });
  };

  const group = {
    get: (fieldName: string) => {
      return getGroupFromState(fieldName, formState);
    },
    add: (fieldName: string) => {
      setFormState((formState) => {
        const newKey = key(fieldName, Math.random().toString(36).substring(2));
        return {
          ...formState,
          fields: {
            ...formState.fields,
            [newKey]: { ...DEFAULT_FIELD_STATE },
          },
        };
      });
    },
    delete: (stateFieldKey: string) => {
      setFormState((formState) => {
        const fieldsCopy = { ...formState.fields };
        delete fieldsCopy[stateFieldKey];
        return {
          ...formState,
          fields: fieldsCopy,
        };
      });
    },
  };

  const hasInvalidFields = Object.values(formState.fields).some(
    (fieldState) => fieldState.status === FieldStatus.Invalid,
  );
  const visualStatus = hasInvalidFields ? FormStatus.Invalid : formState.status;

  return {
    formState,
    visualStatus,
    setFormState,
    setFieldState,
    getFormOptionsForUpdatingFormState,
    onChangeHandlerForUpdatingFormState,
    group,
  };
};

export default useForm;
