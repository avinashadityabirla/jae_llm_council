function Step8_SignOff({ data, onChange }) {
  const so = data || {};

  const upd = (field, v) => onChange({ ...so, [field]: v });

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Step 8 — Sign-Off</h2>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Final sign-off block. Fill signatures and names; click{" "}
        <b>Generate JD (AI)</b> to produce the AI content, then{" "}
        <b>Download Word</b> to export as .docx.
      </p>

      <div style={sectionBox}>
        <h3 style={{ color: "#8B0000", marginTop: 0 }}>Jobholder</h3>

        <div style={grid}>
          <Field
            label="Signature"
            value={so.signature}
            onChange={(v) => upd("signature", v)}
          />

          <Field
            label="Name"
            value={so.name}
            onChange={(v) => upd("name", v)}
          />

          <Field
            label="Date"
            value={so.date}
            onChange={(v) => upd("date", v)}
            type="date"
          />
        </div>
      </div>

      <div style={sectionBox}>
        <h3 style={{ color: "#8B0000", marginTop: 0 }}>Job Analyst</h3>

        <div style={grid}>
          <Field
            label="Signature"
            value={so.analystSignature}
            onChange={(v) => upd("analystSignature", v)}
          />

          <Field
            label="Name"
            value={so.analystName}
            onChange={(v) => upd("analystName", v)}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

const grid = {
  display: "grid",

  gridTemplateColumns: "1fr 1fr 1fr",

  gap: "15px",
};

const sectionBox = {
  background: "#f9fafb",

  padding: "20px",

  borderRadius: "8px",

  marginBottom: "20px",

  border: "1px solid #e5e7eb",
};

const labelStyle = {
  display: "block",

  fontSize: "13px",

  fontWeight: "600",

  marginBottom: "5px",
};

const inputStyle = {
  width: "100%",

  padding: "8px 10px",

  border: "1px solid #d1d5db",

  borderRadius: "6px",

  fontSize: "14px",

  boxSizing: "border-box",
};

export default Step8_SignOff;
