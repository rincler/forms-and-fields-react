import {
  FieldOptions,
  FieldStatus,
  FieldValue,
  FormOptions,
  FormStatus,
  SubmissionResult,
  SubmitFn,
  ValidationResult,
  Validator,
} from "forms-and-fields";
import { HTMLAttributes } from "react";

export interface FieldState {
  status: FieldStatus;
  validationResult: ValidationResult | null;
  value?: FieldValue;
}

export interface FieldProps {
  validators?: Validator[];
  options?: FieldOptions;
  isStandalone?: boolean;
  name?: string;
  fieldState?: FieldState;
}

export interface FormState {
  status: FormStatus;
  validationResult: ValidationResult | null;
  submissionResult: SubmissionResult | null;
  fields: Record<string, FieldState>;
}

export interface FormProps extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  submit: SubmitFn;
  options?: FormOptions;
  formState?: FormState;
}
