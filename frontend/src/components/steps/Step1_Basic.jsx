const AMC_FUNCTIONS = [
  "Investments",

  "Sales & Distribution",

  "Operations",

  "Compliance",

  "Finance",

  "Risk",

  "Technology",

  "HR",

  "Legal",
];

const NBFC_FUNCTIONS = [
  "Credit",

  "Underwriting",

  "Collections",

  "Branch Banking",

  "Channel Sales",

  "Risk Analytics",
];

const BANDS = ["JB 2", "JB 3", "JB 4", "JB 5", "JB 6", "JB 7", "JB 8"];

function Step1_Basic({ data, onChange }) {
  const upd = (field, value) => {
    const updated = { ...data };

    updated[field] = value;

    onChange(updated);
  };

  const funcOptions =
    data.lob === "AMC"
      ? AMC_FUNCTIONS
      : data.lob === "NBFC"
        ? NBFC_FUNCTIONS
        : [];

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Step 1 — Basic Details</h2>

      <p style={{ color: "#666", fontSize: "14px" }}>
        All fields below are mandatory (non-negotiable per BRD).
      </p>

      <div style={grid}>
        <Select
          label="LOB *"
          value={data.lob}
          onChange={(v) => upd("lob", v)}
          options={[
            { v: "", l: "Select..." },

            { v: "AMC", l: "AMC (ABSLAMC)" },

            { v: "NBFC", l: "NBFC" },
          ]}
        />

        <Input
          label="Business *"
          value={data.business}
          onChange={(v) => upd("business", v)}
          placeholder="e.g. Aditya Birla Sun Life AMC"
        />

        <Input
          label="Unit *"
          value={data.unit}
          onChange={(v) => upd("unit", v)}
          placeholder="e.g. Investments"
        />

        <Input
          label="Location *"
          value={data.location}
          onChange={(v) => upd("location", v)}
          placeholder="e.g. Mumbai"
        />

        <Input
          label="Poornata Position Number"
          value={data.positionNumber}
          onChange={(v) => upd("positionNumber", v)}
          placeholder="e.g. 12345"
        />

        <Input
          label="Reports To: Position Number"
          value={data.reportsToNumber}
          onChange={(v) => upd("reportsToNumber", v)}
          placeholder="e.g. 12300"
        />

        <Input
          label="Poornata Position Title"
          value={data.positionTitle}
          onChange={(v) => upd("positionTitle", v)}
          placeholder="e.g. Senior Fund Manager"
        />

        <Input
          label="Reports To: Position Title"
          value={data.reportsToTitle}
          onChange={(v) => upd("reportsToTitle", v)}
          placeholder="e.g. CIO"
        />

        <Select
          label="Function *"
          value={data.function}
          onChange={(v) => upd("function", v)}
          options={[
            { v: "", l: data.lob ? "Select..." : "Select LOB first" },

            ...funcOptions.map((f) => ({ v: f, l: f })),
          ]}
        />

        <Input
          label="Reports To: Function"
          value={data.reportsToFunction}
          onChange={(v) => upd("reportsToFunction", v)}
          placeholder="e.g. Investments"
        />

        <Input
          label="Department *"
          value={data.department}
          onChange={(v) => upd("department", v)}
          placeholder="e.g. Equity"
        />

        <Input
          label="Reports To: Department"
          value={data.reportsToDepartment}
          onChange={(v) => upd("reportsToDepartment", v)}
          placeholder="e.g. Investments"
        />

        <Input
          label="Designation of Employee *"
          value={data.designation}
          onChange={(v) => upd("designation", v)}
          placeholder="e.g. Senior Fund Manager"
        />

        <Input
          label="Designation of Manager"
          value={data.managerDesignation}
          onChange={(v) => upd("managerDesignation", v)}
          placeholder="e.g. CIO"
        />

        <Select
          label="Band *"
          value={data.band}
          onChange={(v) => upd("band", v)}
          options={[
            { v: "", l: "Select..." },

            ...BANDS.map((b) => ({ v: b, l: b })),
          ]}
        />

        <Input
          label="Date"
          type="date"
          value={data.date}
          onChange={(v) => upd("date", v)}
        />
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, background: "white" }}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </div>
  );
}

const grid = {
  display: "grid",

  gridTemplateColumns: "1fr 1fr",

  gap: "15px",

  marginTop: "20px",
};

const labelStyle = {
  display: "block",

  fontSize: "13px",

  fontWeight: "600",

  marginBottom: "5px",

  color: "#333",
};

const inputStyle = {
  width: "100%",

  padding: "8px 10px",

  border: "1px solid #d1d5db",

  borderRadius: "6px",

  fontSize: "14px",

  boxSizing: "border-box",
};

export default Step1_Basic;
