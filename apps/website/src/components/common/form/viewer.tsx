import { sendEmailFromForm } from "apps/website/src/app/api/contact/route";
import { Form as FormModel } from "apps/website/src/types/shared";
import React from "react";
import { Form as FormEl, FormItem, Input, TextArea } from ".";
import Button from "../button";
import Typography from "../typography";
import Select from "./Select";

const FormViewer: React.FC<FormModel> = (props) => {
  const {
    title,
    description,
    formItemsCollection,
    submitButtonLabel,
    resetButtonLabel,
    honeypotEnabled,
    rateLimitMax,
    rateLimitTimeframe,
  } = props;

  const items = formItemsCollection?.items ?? [];

  const [values, setValues] = React.useState<Record<string, any>>(() =>
    items.reduce(
      (acc, it) => ({ ...acc, [it.fieldName]: it.defaultValue ?? "" }),
      {},
    ),
  );
  const [errors, setErrors] = React.useState<
    Record<string, string | undefined>
  >({});
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type } = e.target as HTMLInputElement;
    const value =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setValues((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const next: Record<string, string | undefined> = {};
    for (const it of items) {
      const v = values[it.fieldName];
      if (
        it.required &&
        (v === undefined || v === null || String(v).trim() === "")
      ) {
        next[it.fieldName] = "Required";
        continue;
      }
      if (it.fieldType === "email" && v) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)))
          next[it.fieldName] = "Invalid email";
      }
      if (
        typeof it.minLength === "number" &&
        v &&
        String(v).length < it.minLength
      ) {
        next[it.fieldName] = `Min ${it.minLength} chars`;
      }
      if (
        typeof it.maxLength === "number" &&
        v &&
        String(v).length > it.maxLength
      ) {
        next[it.fieldName] = `Max ${it.maxLength} chars`;
      }
      if (it.pattern && v) {
        try {
          const re = new RegExp(it.pattern);
          if (!re.test(String(v))) next[it.fieldName] = "Invalid format";
        } catch {}
      }
    }
    setErrors(next);
    return Object.values(next).every((x) => !x);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, value);
      }
      const res = await sendEmailFromForm(formData, "Contact form");

      console.log(res);

      if (!res.ok) {
        throw new Error("Failed to send email");
      }
      setValues(
        items.reduce(
          (acc, it) => ({ ...acc, [it.fieldName]: it.defaultValue ?? "" }),
          {},
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderControl = (it: (typeof items)[number]) => {
    const maxLen = typeof it.maxLength === "number" ? it.maxLength : undefined;
    const common = {
      name: it.fieldName,
      placeholder: it.placeholder ?? undefined,
      maxLength: maxLen,
      disabled: submitting,
      value: values[it.fieldName] ?? "",
      onChange: handleChange,
      fullWidth: true,
    } as const;

    switch (it.fieldType) {
      case "textarea":
        return (
          <TextArea rows={5} {...common} value={values[it.fieldName] ?? ""} />
        );
      case "email":
      case "tel":
      case "date":
      case "text":
        return (
          <Input
            type={it.fieldType === "text" ? "text" : it.fieldType}
            {...common}
          />
        );
      case "select":
        return (
          <Select
            name={it.fieldName}
            value={values[it.fieldName] ?? ""}
            onChange={handleChange}
            disabled={submitting}
            style={{ width: "100%", padding: 12 }}
            options={
              it.options?.map((opt) => ({ value: opt, label: opt })) ?? []
            }
          />
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            name={it.fieldName}
            checked={Boolean(values[it.fieldName])}
            onChange={handleChange}
            disabled={submitting}
          />
        );
      case "radio":
        return (
          <div>
            {(it.options ?? []).map((opt, idx) => (
              <label key={idx} style={{ marginRight: 12 }}>
                <input
                  type="radio"
                  name={it.fieldName}
                  value={opt}
                  checked={values[it.fieldName] === opt}
                  onChange={handleChange}
                  disabled={submitting}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      default:
        return <Input {...common} />;
    }
  };

  return (
    <div>
      {!!title && (
        <Typography variant="h4" element="h4" style={{ marginBlock: 0 }}>
          {title}
        </Typography>
      )}
      {!!description && (
        <Typography variant="body1" element="p">
          {description}
        </Typography>
      )}

      <FormEl
        onSubmit={onSubmit}
        withHoneypot={honeypotEnabled ?? true}
        rateLimit={{
          maxSubmissions: rateLimitMax ?? 3,
          timeframeMs: rateLimitTimeframe ?? 60000,
        }}
      >
        {items.map((it) => (
          <FormItem
            key={it.fieldName}
            label={it.label}
            helperText={it.helperText}
            error={errors[it.fieldName]}
            required={Boolean(it.required)}
          >
            {renderControl(it)}
          </FormItem>
        ))}

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button type="submit" disabled={submitting} size="xs">
            {submitButtonLabel || "Submit"}
          </Button>
          {!!resetButtonLabel && (
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setValues(
                  items.reduce(
                    (acc, it) => ({
                      ...acc,
                      [it.fieldName]: it.defaultValue ?? "",
                    }),
                    {},
                  ),
                );
                setErrors({});
              }}
              disabled={submitting}
            >
              {resetButtonLabel}
            </Button>
          )}
        </div>
      </FormEl>
    </div>
  );
};

export default FormViewer;
