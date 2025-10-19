"use client";
import React, { forwardRef, useMemo } from "react";
import { InputStyled } from "./styles";

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size"> {
  /**
   * Error state for styling
   */
  error?: boolean;
  
  /**
   * Set width to 100%
   */
  fullWidth?: boolean;
  
  /**
   * Regular expression pattern for validation
   */
  validationPattern?: RegExp;
  
  /**
   * Maximum character length for input (recommended for security)
   */
  maxLength?: number;
  
  /**
   * Sanitize input values automatically
   */
  sanitize?: boolean;
}

/**
 * Secure Input component with built-in sanitization and validation
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      fullWidth,
      type,
      value,
      onChange,
      maxLength = 255,
      pattern,
      validationPattern,
      sanitize = true,
      ...props
    },
    ref
  ) => {
    // Generate appropriate pattern based on input type for security
    const inputPattern = useMemo(() => {
      if (validationPattern) return validationPattern.source;
      if (pattern) return pattern;
      
      // Default patterns for common types to prevent injection attacks
      switch (type) {
        case "email":
          return "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}";
        case "tel":
          return "[0-9+\\-\\s()]{5,20}";
        default:
          return undefined;
      }
    }, [validationPattern, pattern, type]);

    // Sanitize input to prevent XSS
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (sanitize && typeof e.target.value === "string") {
        // Sanitize input to prevent XSS attacks
        const sanitized = e.target.value
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\\/g, "&#92;");
        
        // Update the input with sanitized value
        e.target.value = sanitized;
      }
      
      onChange?.(e);
    };

    return (
      <InputStyled
        ref={ref}
        $error={error}
        $fullWidth={fullWidth}
        type={type || "text"}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        pattern={inputPattern}
        spellCheck={type !== "email" && type !== "password"}
        autoComplete={type === "password" ? "current-password" : props.autoComplete}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
