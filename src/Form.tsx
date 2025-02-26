import Field, { getFieldName } from "./Field";
import {
  Field as FieldClass,
  Form as FormClass,
  FormOptions,
  FieldsValidationResult,
} from "forms-and-fields";
import React, { FC, PropsWithChildren, ReactElement, useEffect, useRef, useState } from "react";
import { getChildrenByTypeDeep } from "react-nanny";
import { FieldProps, FormProps } from "./types";
import { getGroupFromState } from "./useForm";

const updateForm = (form: FormClass, { submit, options, formState, children }: FormProps) => {
  const fieldValidationResult: FieldsValidationResult = {};

  const fieldComponents = getChildrenByTypeDeep(children, Field);
  fieldComponents.forEach((fieldComponent, fieldIndex) => {
    const fieldComponentProps = (fieldComponent as ReactElement<FieldProps>).props;
    const field = form.fields[fieldIndex];

    field.validators = fieldComponentProps.validators || [];
    field.options = fieldComponentProps.options || {};
    field.getVirtualFieldsOfGroup().forEach((virtualField) => {
      virtualField.validators = fieldComponentProps.validators || [];
      virtualField.options = fieldComponentProps.options || {};
      form.setOptionsToField(options || {}, virtualField);
    });

    if (formState) {
      const fieldName = fieldComponentProps.name || getFieldName(fieldComponent);
      if (formState.fields[fieldName]) {
        if (formState.fields[fieldName].validationResult) {
          fieldValidationResult[fieldName] = formState.fields[fieldName].validationResult;
        }
        field.status = formState.fields[fieldName].status;
        field.validationResult = formState.fields[fieldName].validationResult;
      } else {
        getGroupFromState(fieldName, formState).forEach(([key, fieldState], groupFieldIndex) => {
          const groupFieldElement = field
            .getGroupElements()
            .find((fieldElement) => fieldElement.dataset.key === key);

          if (!groupFieldElement) {
            return;
          }

          const virtualField = field.getVirtualFieldForElement(groupFieldElement);
          if (fieldState.validationResult) {
            fieldValidationResult[`${fieldName}.${groupFieldIndex}`] = fieldState.validationResult;
          }
          virtualField.status = fieldState.status;
          virtualField.validationResult = fieldState.validationResult;
        });
      }
    }
  });

  form.submit = submit;
  form.setOptions(options || {});

  if (formState) {
    form.status = formState.status;
    form.validationResult = formState.validationResult
      ? {
          ...fieldValidationResult,
          "*": formState.validationResult,
        }
      : null;
    form.submissionResult = formState.submissionResult;
  }
};

const defaultOptions: FormOptions = {
  cssStatusEnabled: false,
};

const Form: FC<PropsWithChildren<FormProps>> = ({
  submit,
  options,
  formState,
  children,
  ...props
}) => {
  const form = useRef<FormClass | null>(null);
  const [formId, setFormId] = useState("");

  const fieldComponents = getChildrenByTypeDeep(children, Field);
  const fieldNames = fieldComponents.map((fieldComponent) => {
    return (fieldComponent as ReactElement<FieldProps>).props.name || getFieldName(fieldComponent);
  });

  useEffect(() => {
    if (!formId) {
      setFormId(Math.random().toString(36).substring(2));
      return;
    }

    const fields = fieldComponents.map((fieldComponent) => {
      const fieldComponentProps = (fieldComponent as ReactElement<FieldProps>).props;
      const fieldName = fieldComponentProps.name || getFieldName(fieldComponent);

      return new FieldClass(
        `[name="${fieldName}"]`,
        `[data-form-id="${formId}"]`,
        fieldComponentProps.validators,
        fieldComponentProps.options,
      );
    });

    form.current = new FormClass(`[data-form-id="${formId}"]`, fields, submit, {
      ...defaultOptions,
      ...options,
    });
    const stopListening = form.current.listen();

    return () => {
      stopListening();
    };
  }, [formId, fieldNames.join(",")]);

  useEffect(() => {
    if (form.current) {
      updateForm(form.current, {
        submit,
        options: {
          ...defaultOptions,
          ...options,
        },
        formState,
        children,
      });
    }
  });

  return (
    <form data-form-id={formId} {...props}>
      {children}
    </form>
  );
};

export default Form;
