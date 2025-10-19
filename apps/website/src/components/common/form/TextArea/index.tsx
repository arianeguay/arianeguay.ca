"use client";
import React, { forwardRef } from "react";
import { TextAreaStyled } from "./styles";

export interface TextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "rows"> {
  /**
   * Error state for styling
   */
  error?: boolean;
  
  /**
   * Set width to 100%
   */
  fullWidth?: boolean;
  
  /**
   * Number of visible text lines
   */
  rows?: number;
  
  /**
   * Maximum character length for textarea (recommended for security)
   */
  maxLength?: number;
  
  /**
   * Sanitize input values automatically
   */
  sanitize?: boolean;
}

/**
 * Secure TextArea component with built-in sanitization
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { error, fullWidth, rows, onChange, maxLength = 1000, sanitize = true, ...props },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (sanitize && typeof e.target.value === "string") {
        // Sanitize input to prevent XSS attacks
        const sanitized = e.target.value
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;")
          .replace(/\\/g, "&#92;");
        
        // Update the textarea with sanitized value
        e.target.value = sanitized;
      }
      
      onChange?.(e);
    };

    return (
      <TextAreaStyled
        ref={ref}
        $error={error}
        $fullWidth={fullWidth}
        $rows={rows}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";
export default TextArea;
