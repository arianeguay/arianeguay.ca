"use client";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  NativeSelect,
  SelectContainer,
  SelectListbox,
  SelectOptionItem,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
} from "./styles";

interface SelectOption {
  value: string;
  label: string;
}
export interface SelectProps
  extends Omit<React.ComponentProps<"select">, "rows"> {
  /**
   * Error state for styling
   */
  error?: boolean;

  /**
   * Set width to 100%
   */
  fullWidth?: boolean;

  options: SelectOption[];
  /**
   * Sanitize input values automatically
   */
  sanitize?: boolean;
  /**
   * Placeholder text to show when no value is selected
   */
  placeholder?: string;
}

/**
 * Secure Select component with built-in sanitization
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      error,
      fullWidth,
      onChange,
      sanitize = true,
      options,
      value,
      defaultValue,
      id,
      disabled,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const nativeRef = useRef<HTMLSelectElement | null>(null);
    const mergedRef = (node: HTMLSelectElement | null) => {
      nativeRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLSelectElement | null>).current =
          node;
    };

    const [open, setOpen] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | undefined
    >(
      typeof value === "string"
        ? undefined
        : (defaultValue as string | undefined),
    );
    const currentValue =
      (value as string | undefined) ?? uncontrolledValue ?? "";
    const [highlighted, setHighlighted] = useState<number>(-1);

    const selectedLabel = useMemo(() => {
      const found = options.find((o) => o.value === currentValue);
      return found ? found.label : "";
    }, [options, currentValue]);

    useEffect(() => {
      if (!open) return;
      const onDocClick = (e: MouseEvent) => {
        if (!(e.target instanceof Node)) return;
        const root = containerRef.current;
        if (root && !root.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const listboxId = useMemo(() => `${id ?? "select"}-listbox`, [id]);

    const sanitizeValue = (val: string) => {
      if (!sanitize) return val;
      return val
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\\/g, "&#92;");
    };

    const commitChange = (val: string) => {
      const sanitized = sanitizeValue(val);
      const el = nativeRef.current;
      if (el) {
        el.value = sanitized;
        const evt = new Event("change", { bubbles: true });
        el.dispatchEvent(evt);
      }
      if (value === undefined) setUncontrolledValue(sanitized);
      setOpen(false);
    };

    const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
        setHighlighted((prev) => {
          const next =
            e.key === "ArrowDown"
              ? Math.min(prev + 1, options.length - 1)
              : Math.max(prev - 1, 0);
          return next < 0 ? 0 : next;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!open) setOpen(true);
        else if (highlighted >= 0) commitChange(options[highlighted].value);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (highlighted >= 0) commitChange(options[highlighted].value);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const handleNativeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (typeof e.target.value === "string") {
        const sanitized = sanitizeValue(e.target.value);
        e.target.value = sanitized;
      }
      if (value === undefined) setUncontrolledValue(e.target.value);
      onChange?.(e);
    };

    useEffect(() => {
      if (!open) setHighlighted(-1);
    }, [open]);

    return (
      <SelectContainer ref={containerRef} $fullWidth={fullWidth}>
        <NativeSelect
          ref={mergedRef}
          id={id}
          disabled={disabled}
          value={currentValue}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={handleNativeChange}
          aria-hidden
          tabIndex={-1}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </NativeSelect>

        <SelectTrigger
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          onClick={() => !disabled && setOpen((s) => !s)}
          onKeyDown={onTriggerKeyDown}
          $error={error}
          $fullWidth={fullWidth}
        >
          {selectedLabel ? (
            <SelectValue>{selectedLabel}</SelectValue>
          ) : (
            <SelectPlaceholder>{placeholder}</SelectPlaceholder>
          )}
        </SelectTrigger>

        <SelectListbox
          id={listboxId}
          role="listbox"
          aria-activedescendant={
            highlighted >= 0 ? `${listboxId}-opt-${highlighted}` : undefined
          }
          tabIndex={-1}
          $open={open}
          onKeyDown={onListKeyDown}
        >
          {options.map((o, idx) => {
            const active = o.value === currentValue || idx === highlighted;
            return (
              <SelectOptionItem
                key={o.value}
                id={`${listboxId}-opt-${idx}`}
                role="option"
                aria-selected={o.value === currentValue}
                $active={active}
                onMouseEnter={() => setHighlighted(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commitChange(o.value)}
              >
                {o.label}
              </SelectOptionItem>
            );
          })}
        </SelectListbox>
      </SelectContainer>
    );
  },
);

Select.displayName = "Select";
export default Select;
