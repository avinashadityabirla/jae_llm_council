import { useState } from "react";

import { useJDStore } from "../store/useJDStore";

function CommitteeLaunch({ onBack, onLaunched }) {
  const [nuances, setNuances] = useState({
    context: "",

    history: "",

    comparableRoles: "",

    notes: "",
  });

  const launchCommittee = useJDStore((s) => s.launchCommittee);

  const generatedJd = useJDStore((s) => s.generatedJd);

  const wizardData = useJDStore((s) => s.wizardData);

  const loading = useJDStore((s) => s.committeeLoading);

  const b = wizardData.basic || {};

  const upd = (field, v) => setNuances({ ...nuances, [field]: v });

  const handleLaunch = async () => {
    const id = await launchCommittee(nuances);

    if (id) onLaunched();
  };

  const agents = [
    { name: "Business Head", desc: "Auto-selected based on LOB + Department" },

    { name: "HR Business Partner", desc: "Organizational parity view" },

    { name: "Finance Partner", desc: "Financial rigor view" },

    { name: "JAE COE Facilitator", desc: "Orchestrator + final arbiter" },
  ];

  return (
    <div style={{ padding: "30px 40px", maxWidth: "900px", margin: "0 auto" }}>
      <button onClick={onBack} style={btnSecondary}>
        ← Back
      </button>

      <h1 style={{ color: "#8B0000", marginTop: "15px" }}>
        Launch JAE Committee
      </h1>

      <p style={{ color: "#666" }}>
        The committee will debate this role and produce a Hay-based verdict with
        recommended band.
      </p>

      <div style={box}>
        <h3 style={sectionHead}>Role Being Evaluated</h3>

        <p>
          <b>{b.designation}</b> | {b.lob} | {b.department} | Target: {b.band}
        </p>
      </div>

      <div style={box}>
        <h3 style={sectionHead}>Committee Members (Auto-Selected)</h3>

        {agents.map((a, i) => (
          <div key={i} style={{ marginBottom: "8px" }}>
            <b style={{ color: "#0066cc" }}>{a.name}</b>

            <span
              style={{ color: "#666", marginLeft: "8px", fontSize: "13px" }}
            >
              — {a.desc}
            </span>
          </div>
        ))}
      </div>

      <div style={box}>
        <h3 style={sectionHead}>Nuances & Context (Optional)</h3>

        <p style={{ fontSize: "13px", color: "#666" }}>
          Provide any additional context the committee should consider.
        </p>

        <label style={labelStyle}>Special context for this role</label>

        <textarea
          rows={3}
          value={nuances.context}
          onChange={(e) => upd("context", e.target.value)}
          placeholder="e.g. This is a newly created role after last year's org restructure..."
          style={textareaStyle}
        />

        <label style={labelStyle}>Historical evaluations or precedent</label>

        <textarea
          rows={3}
          value={nuances.history}
          onChange={(e) => upd("history", e.target.value)}
          placeholder="e.g. Previous incumbent was at JB 6, role has since expanded scope..."
          style={textareaStyle}
        />

        <label style={labelStyle}>Comparable roles across ABCL</label>

        <textarea
          rows={3}
          value={nuances.comparableRoles}
          onChange={(e) => upd("comparableRoles", e.target.value)}
          placeholder="e.g. Similar to Head of Retail Sales in Life Insurance..."
          style={textareaStyle}
        />

        <label style={labelStyle}>Any specific points for the committee</label>

        <textarea
          rows={3}
          value={nuances.notes}
          onChange={(e) => upd("notes", e.target.value)}
          placeholder="e.g. Please pay attention to the regulatory exposure aspect..."
          style={textareaStyle}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          onClick={handleLaunch}
          disabled={loading || !generatedJd}
          style={btnPrimary}
        >
          {loading ? "Launching..." : "Launch Committee →"}
        </button>
      </div>

      {!generatedJd && (
        <p style={{ marginTop: "15px", color: "#991b1b", fontSize: "13px" }}>
          Please generate the JD first before launching the committee.
        </p>
      )}
    </div>
  );
}

const box = {
  background: "white",

  padding: "20px",

  borderRadius: "8px",

  border: "1px solid #eee",

  marginTop: "20px",
};

const sectionHead = { color: "#8B0000", marginTop: 0, marginBottom: "10px" };

const labelStyle = {
  display: "block",

  fontSize: "13px",

  fontWeight: "600",

  marginTop: "12px",

  marginBottom: "5px",
};

const textareaStyle = {
  width: "100%",

  padding: "10px",

  border: "1px solid #d1d5db",

  borderRadius: "6px",

  fontSize: "14px",

  fontFamily: "inherit",

  boxSizing: "border-box",

  resize: "vertical",
};

const btnPrimary = {
  padding: "12px 24px",

  background: "#8B0000",

  color: "white",

  border: "none",

  borderRadius: "6px",

  cursor: "pointer",

  fontWeight: "bold",
};

const btnSecondary = {
  padding: "8px 16px",

  background: "#f3f4f6",

  border: "1px solid #d1d5db",

  borderRadius: "6px",

  cursor: "pointer",

  color: "#333",
};

export default CommitteeLaunch;
