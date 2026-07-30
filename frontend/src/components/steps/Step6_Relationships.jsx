function Step6_Relationships({ data, onChange }) {
  const rel = data || { internal: [], external: [] };

  const upd = (kind, list) => {
    const next = { ...rel };

    next[kind] = list;

    onChange(next);
  };

  const addRow = (kind) => {
    const list = rel[kind] || [];

    upd(kind, [...list, { type: "", frequency: "", nature: "" }]);
  };

  const removeRow = (kind, i) => {
    const list = rel[kind] || [];

    upd(
      kind,

      list.filter((_, idx) => idx !== i),
    );
  };

  const updateRow = (kind, i, field, value) => {
    const list = rel[kind] || [];

    const nextList = list.map((r, idx) => {
      if (idx !== i) return r;

      const updated = { ...r };

      updated[field] = value;

      return updated;
    });

    upd(kind, nextList);
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Step 6 — Relationships</h2>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Capture the stakeholders this role interacts with, split by Internal and
        External.
      </p>

      <Group
        title="Internal Relationships"
        rows={rel.internal}
        onAdd={() => addRow("internal")}
        onRemove={(i) => removeRow("internal", i)}
        onChange={(i, field, value) => updateRow("internal", i, field, value)}
      />

      <Group
        title="External Relationships"
        rows={rel.external}
        onAdd={() => addRow("external")}
        onRemove={(i) => removeRow("external", i)}
        onChange={(i, field, value) => updateRow("external", i, field, value)}
      />
    </div>
  );
}

function Group({ title, rows, onAdd, onRemove, onChange }) {
  const list = rows || [];

  return (
    <div style={{ marginTop: "25px" }}>
      <h3 style={{ color: "#8B0000", marginBottom: "10px" }}>{title}</h3>

      {list.length === 0 && (
        <div style={emptyBox}>
          No entries. Click <b>+ Add</b> below.
        </div>
      )}

      {list.map((r, i) => (
        <div key={i} style={rowStyle}>
          <input
            value={r.type || ""}
            onChange={(e) => onChange(i, "type", e.target.value)}
            placeholder="Relationship (e.g. CEO)"
            style={inputStyle}
          />

          <input
            value={r.frequency || ""}
            onChange={(e) => onChange(i, "frequency", e.target.value)}
            placeholder="Frequency (e.g. Weekly)"
            style={inputStyle}
          />

          <input
            value={r.nature || ""}
            onChange={(e) => onChange(i, "nature", e.target.value)}
            placeholder="Nature (e.g. Strategy alignment)"
            style={inputStyle}
          />

          <button onClick={() => onRemove(i)} style={xBtn}>
            ×
          </button>
        </div>
      ))}

      <button onClick={onAdd} style={addBtn}>
        + Add {title}
      </button>
    </div>
  );
}

const rowStyle = {
  display: "grid",

  gridTemplateColumns: "2fr 1fr 2fr auto",

  gap: "8px",

  marginBottom: "8px",

  alignItems: "center",
};

const inputStyle = {
  padding: "8px 10px",

  border: "1px solid #d1d5db",

  borderRadius: "6px",

  fontSize: "14px",

  boxSizing: "border-box",

  width: "100%",
};

const emptyBox = {
  padding: "20px",

  textAlign: "center",

  border: "2px dashed #ddd",

  borderRadius: "8px",

  color: "#999",

  marginBottom: "10px",
};

const xBtn = {
  padding: "6px 12px",

  background: "#fee2e2",

  color: "#991b1b",

  border: "none",

  borderRadius: "4px",

  cursor: "pointer",

  fontWeight: "bold",
};

const addBtn = {
  marginTop: "10px",

  padding: "8px 16px",

  background: "#8B0000",

  color: "white",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer",

  fontWeight: "bold",
};

export default Step6_Relationships;
