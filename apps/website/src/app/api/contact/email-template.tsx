interface EmailTemplateProps {
  formData: FormData;
}

export function EmailTemplate({ formData }: EmailTemplateProps) {
  const data: Record<string, FormDataEntryValue> = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  const prioritize = [
    "name",
    "fullName",
    "firstName",
    "lastName",
    "email",
    "phone",
    "subject",
    "message",
  ];

  const entries = Object.entries(data).sort((a, b) => {
    const ia = prioritize.findIndex(
      (k) => k.toLowerCase() === a[0].toLowerCase(),
    );
    const ib = prioritize.findIndex(
      (k) => k.toLowerCase() === b[0].toLowerCase(),
    );
    const sa = ia === -1 ? Number.MAX_SAFE_INTEGER : ia;
    const sb = ib === -1 ? Number.MAX_SAFE_INTEGER : ib;
    if (sa !== sb) return sa - sb;
    return a[0].localeCompare(b[0]);
  });

  return (
    <div
      style={{
        backgroundColor: "#f6f6f8",
        padding: "24px 0",
        fontFamily:
          "Inter, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 20,
            borderBottom: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, lineHeight: "24px" }}>
            New form submission
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "#64748b" }}>
            {new Date().toLocaleString()}
          </p>
        </div>

        <div style={{ padding: 20 }}>
          <table
            width="100%"
            cellPadding={0}
            cellSpacing={0}
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              {entries.map(([key, value]) => (
                <tr key={key} style={{ verticalAlign: "top" }}>
                  <td
                    style={{
                      width: 160,
                      padding: "8px 12px 8px 0",
                      fontWeight: 600,
                      color: "#334155",
                      wordBreak: "break-word",
                    }}
                  >
                    {key}
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#0f172a",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{ padding: 16, borderTop: "1px solid #e5e7eb", background: "#fafafa" }}
        >
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
            This email was generated from a submission on arianeguay.ca
          </p>
        </div>
      </div>
    </div>
  );
}
