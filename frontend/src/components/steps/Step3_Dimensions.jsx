function Step3_Dimensions({ data, onChange }) {
  const dims = data || [];

  const add = () =>
    onChange([
      ...dims,

      { name: "", fyPrevious: "", fyCurrent: "", remarks: "" },
    ]);

  const upd = (i, field, value) => {
    const newDims = dims.map((d, idx) => {
      if (idx !== i) return d;

      const updated = { ...d };

      updated[field] = value;

      return updated;
    });

    onChange(newDims);
  };

  const rem = (i) => onChange(dims.filter((_, idx) => idx !== i));

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Step 3 — Dimensions</h2>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Add quantifiable metrics the role is accountable for (AUM, revenue, team
        size, branches, etc.).
      </p>

      {dims.length === 0 && (
        <div
          style={{
            padding: "40px",

            textAlign: "center",

            border: "2px dashed #ddd",

            borderRadius: "8px",

            color: "#999",

            marginTop: "20px",
          }}
        >
          No dimensions yet. Click <b>+ Add Dimension</b> below.
        </div>
      )}

      {dims.map((d, i) => (
        <div
          key={i}
          style={{
            display: "grid",

            gridTemplateColumns: "2fr 1fr 1fr 2fr auto",

            gap: "10px",

            marginTop: "12px",

            alignItems: "end",
          }}
        >
          <Input
            label={i === 0 ? "Dimension" : ""}
            value={d.name}
            onChange={(v) => upd(i, "name", v)}
            placeholder="e.g. AUM"
          />

          <Input
            label={i === 0 ? "FY Previous" : ""}
            value={d.fyPrevious}
            onChange={(v) => upd(i, "fyPrevious", v)}
            placeholder="e.g. 15,000 Cr"
          />

          <Input
            label={i === 0 ? "FY Current" : ""}
            value={d.fyCurrent}
            onChange={(v) => upd(i, "fyCurrent", v)}
            placeholder="e.g. 18,500 Cr"
          />

          <Input
            label={i === 0 ? "Remarks" : ""}
            value={d.remarks}
            onChange={(v) => upd(i, "remarks", v)}
            placeholder="Optional"
          />

          <button
            onClick={() => rem(i)}
            style={{
              padding: "8px 12px",

              background: "#fee2e2",

              color: "#991b1b",

              border: "none",

              borderRadius: "6px",

              cursor: "pointer",

              fontWeight: "bold",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={add}
        style={{
          marginTop: "20px",

          padding: "10px 20px",

          background: "#8B0000",

          color: "white",

          border: "none",

          borderRadius: "6px",

          cursor: "pointer",

          fontWeight: "bold",
        }}
      >
        + Add Dimension
      </button>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",

            fontSize: "13px",

            fontWeight: "600",

            marginBottom: "5px",
          }}
        >
          {label}
        </label>
      )}

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",

          padding: "8px 10px",

          border: "1px solid #d1d5db",

          borderRadius: "6px",

          fontSize: "14px",

          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default Step3_Dimensions;
