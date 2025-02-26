import { Field as FieldClass, FieldElement, FieldOptions } from "forms-and-fields";
import React, {
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { getChildByTypeDeep } from "react-nanny";
import { FieldProps } from "./types";

export const getFieldName = (node: ReactNode): string => {
  const fieldElement = getChildByTypeDeep(node, ["input", "select", "textarea"]);

  if (!fieldElement) {
    throw new Error("A field element not found.");
  }

  const name = (fieldElement as ReactElement<FieldElement>).props.name;

  if (!name) {
    throw new Error("A name of the field element is not set.");
  }

  return name;
};

const updateField = (field: FieldClass, { validators, options, fieldState }: FieldProps) => {
  field.validators = validators || [];
  field.options = options || {};

  if (fieldState) {
    field.status = fieldState.status;
    field.validationResult = fieldState.validationResult;
  }
};

const defaultOptions: FieldOptions = {
  cssStatusEnabled: false,
};

const Field: FC<PropsWithChildren<FieldProps>> = ({
  validators,
  options,
  isStandalone = false,
  name,
  fieldState,
  children,
}) => {
  const field = useRef<FieldClass | null>(null);
  const [containerId, setContainerId] = useState("");

  useEffect(() => {
    if (!isStandalone) {
      return;
    }

    if (!containerId) {
      setContainerId(Math.random().toString(36).substring(2));
      return;
    }

    const fieldName = name || getFieldName(children);

    field.current = new FieldClass(
      `[name="${fieldName}"]`,
      `[data-container-id="${containerId}"]`,
      validators,
      {
        ...defaultOptions,
        ...options,
      },
    );

    const stopListening = field.current.listen();

    return () => {
      stopListening();
    };
  }, [containerId]);

  useEffect(() => {
    if (field.current) {
      updateField(field.current, {
        validators,
        options: {
          ...defaultOptions,
          ...options,
        },
        fieldState,
      });
    }
  });

  if (!isStandalone) {
    return children;
  }

  return <span data-container-id={containerId}>{children}</span>;
};

export default Field;
