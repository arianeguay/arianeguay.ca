"use client";
import React, { forwardRef, useState, useId } from "react";
import { FormStyled } from "./styles";

export interface FormProps extends React.ComponentProps<"form"> {
  /**
   * CSRF token to protect against cross-site request forgery
   * Should be fetched from the server and included in the form submission
   */
  csrfToken?: string;
  
  /**
   * Enable honeypot field to detect automated submissions
   */
  withHoneypot?: boolean;
  
  /**
   * Rate limit - max submissions within timeframe (milliseconds)
   */
  rateLimit?: {
    maxSubmissions: number;
    timeframeMs: number;
  };
}

/**
 * Secure Form component with CSRF protection, honeypot fields, and rate limiting
 */
const Form = forwardRef<HTMLFormElement, FormProps>(
  (
    { children, csrfToken, withHoneypot = true, rateLimit, onSubmit, ...props },
    ref
  ) => {
    const honeypotId = useId();
    const [submissions, setSubmissions] = useState<number[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Security check: honeypot (if enabled)
      if (withHoneypot) {
        const form = e.currentTarget;
        const honeypot = form.querySelector(
          `input[name="${honeypotId}"]`
        ) as HTMLInputElement;
        
        // If honeypot field is filled, silently abort (bot detected)
        if (honeypot && honeypot.value) {
          console.warn("Possible bot submission detected");
          return;
        }
      }
      
      // Security check: rate limiting (if enabled)
      if (rateLimit) {
        const now = Date.now();
        const recentSubmissions = submissions.filter(
          time => now - time < rateLimit.timeframeMs
        );
        
        if (recentSubmissions.length >= rateLimit.maxSubmissions) {
          console.warn("Rate limit exceeded");
          return;
        }
        
        setSubmissions([...recentSubmissions, now]);
      }
      
      // Pass to original onSubmit handler if provided
      onSubmit?.(e);
    };

    return (
      <FormStyled ref={ref} onSubmit={handleSubmit} {...props}>
        {/* Include CSRF token if provided */}
        {csrfToken && (
          <input type="hidden" name="_csrf" value={csrfToken} />
        )}
        
        {/* Honeypot: hidden field to catch bots */}
        {withHoneypot && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            <input
              type="text"
              name={honeypotId}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        )}
        
        {children}
      </FormStyled>
    );
  }
);

Form.displayName = "Form";
export default Form;
