"use client";
import React, { useId } from "react";
import {
  FormItemStyled,
  LabelStyled,
  HelperTextStyled,
  ErrorTextStyled,
} from "./styles";

export interface FormItemProps extends React.ComponentProps<"div"> {
  /**
   * Label for the form item
   */
  label?: React.ReactNode;

  /**
   * Input id (auto-generated if not provided)
   */
  inputId?: string;

  /**
   * Helper text to display below the input
   */
  helperText?: React.ReactNode;

  /**
   * Error message to display below the input
   */
  error?: React.ReactNode;

  /**
   * Whether the label is required
   */
  required?: boolean;
}

/**
 * FormItem component that wraps an input with a label and optional helper/error text
 */
const FormItem: React.FC<FormItemProps> = ({
  children,
  label,
  inputId: externalId,
  helperText,
  error,
  required,
  ...props
}) => {
  const internalId = useId();
  const id = externalId || internalId;

  return (
    <FormItemStyled {...props}>
      {label && (
        <LabelStyled htmlFor={id}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </LabelStyled>
      )}

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Pass the id and error state to the input element
          return React.cloneElement<any>(
            child as React.FunctionComponentElement<any>,
            {
              id: id ?? "",
              "aria-invalid": Boolean(error),
              "aria-required": required,
              "aria-describedby": error
                ? `${id}-error`
                : helperText
                  ? `${id}-helper`
                  : undefined,
              error: Boolean(error),
              ...(child.props ?? {}),
            },
          );
        }
        return child;
      })}

      {helperText && !error && (
        <HelperTextStyled id={`${id}-helper`}>{helperText}</HelperTextStyled>
      )}

      {error && (
        <ErrorTextStyled id={`${id}-error`} role="alert">
          {error}
        </ErrorTextStyled>
      )}
    </FormItemStyled>
  );
};

export default FormItem;
