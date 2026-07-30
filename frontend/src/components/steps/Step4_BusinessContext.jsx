import { useEffect, useRef } from "react";

import { getBusinessTemplate } from "../../data/businessTemplates";

import MicButton from "../ui/MicButton";

const OUTCOME_OPTIONS = [
  "Revenue Growth",
  "Cost Optimization",
  "Customer Experience",
  "Risk Reduction",

  "Regulatory Compliance",
  "Digital Transformation",
  "Operational Excellence",

  "AUM Growth",
  "Disbursement Growth",
  "Market Share Gain",
  "Portfolio Quality",

  "Talent & Culture",
];

function Step4_BusinessContext({ data, onChange, basic }) {
  const bc = data || {
    rolePurpose: "",

    outcomes: [],

    decisionAuthority: "",

    financials: { budget: "", revenue: "", aum: "", cost: "" },

    autoFilledFor: "",
  };

  const lob = basic?.lob || "";

  const department = basic?.department || "";

  const key = lob + "::" + department;

  const lastKeyRef = useRef(bc.autoFilledFor || "");

  const bcRef = useRef(bc);

  useEffect(() => {
    bcRef.current = bc;
  }, [bc]);

  useEffect(() => {
    if (!lob || !department) return;

    if (lastKeyRef.current === key) return;

    const isMostlyEmpty =
      !bc.rolePurpose &&
      (!bc.outcomes || bc.outcomes.length === 0) &&
      !bc.decisionAuthority;

    if (isMostlyEmpty) {
      const t = getBusinessTemplate(lob, department);

      onChange({
        rolePurpose: t.rolePurpose,

        outcomes: [...t.outcomes],

        decisionAuthority: t.decisionAuthority,

        financials: { ...t.financials },

        autoFilledFor: key,
      });

      lastKeyRef.current = key;
    }
  }, [
    lob,
    department,
    key,
    bc.rolePurpose,
    bc.outcomes,
    bc.decisionAuthority,
    onChange,
  ]);

  const upd = (field, value) => {
    const updated = { ...bcRef.current };

    updated[field] = value;

    bcRef.current = updated;

    onChange(updated);
  };

  const appendRolePurpose = (spoken) => {
    const cur = bcRef.current.rolePurpose || "";

    const sep = cur && !cur.endsWith(" ") ? " " : "";

    upd("rolePurpose", cur + sep + spoken);
  };

  const appendDecisionAuthority = (spoken) => {
    const cur = bcRef.current.decisionAuthority || "";

    const sep = cur && !cur.endsWith(" ") ? " " : "";

    upd("decisionAuthority", cur + sep + spoken);
  };

  const updFinancials = (field, value) => {
    const updated = { ...bcRef.current };

    updated.financials = { ...(bcRef.current.financials || {}) };

    updated.financials[field] = value;

    bcRef.current = updated;

    onChange(updated);
  };

  const toggleOutcome = (o) => {
    const current = bcRef.current.outcomes || [];

    const next = current.includes(o)
      ? current.filter((x) => x !== o)
      : [...current, o];

    upd("outcomes", next);
  };

  const loadTemplate = () => {
    if (!lob || !department) {
      alert("Please fill LOB and Department in Step 1 first.");

      return;
    }

    const t = getBusinessTemplate(lob, department);

    onChange({
      rolePurpose: t.rolePurpose,

      outcomes: [...t.outcomes],

      decisionAuthority: t.decisionAuthority,

      financials: { ...t.financials },

      autoFilledFor: key,
    });

    lastKeyRef.current = key;
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Step 4 — Business Context
          </h2>

          <p className="text-sm text-neutral-500 mt-1">
            Why does this role exist? What outcomes and decisions define it?
          </p>
        </div>

        <button
          onClick={loadTemplate}
          className="btn-secondary text-xs whitespace-nowrap"
        >
          🔄 Load Template ({lob}/{department || "—"})
        </button>
      </div>

      {/* Role Purpose */}

      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-neutral-700">
            Why does this role exist?
          </label>

          <MicButton onAppend={appendRolePurpose} />
        </div>

        <textarea
          value={bc.rolePurpose || ""}
          onChange={(e) => upd("rolePurpose", e.target.value)}
          rows={4}
          placeholder="e.g. To lead the investment management function..."
          className="input resize-y w-full"
        />
      </div>

      {/* Outcomes */}

      <div className="mb-5">
        <label className="text-sm font-semibold text-neutral-700">
          Business Outcomes Expected
        </label>

        <div className="flex flex-wrap gap-2 mt-2">
          {OUTCOME_OPTIONS.map((o) => {
            const selected = (bc.outcomes || []).includes(o);

            return (
              <button
                key={o}
                onClick={() => toggleOutcome(o)}
                className={
                  "px-3 py-1 rounded-full text-xs font-medium border " +
                  (selected
                    ? "bg-abc-red text-white border-abc-red"
                    : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50")
                }
              >
                {selected ? "✓ " : ""}
                {o}
              </button>
            );
          })}
        </div>
      </div>

      {/* Decision Authority */}

      <div className="mb-5">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-neutral-700">
            Decision-Making Authority
          </label>

          <MicButton onAppend={appendDecisionAuthority} />
        </div>

        <textarea
          value={bc.decisionAuthority || ""}
          onChange={(e) => upd("decisionAuthority", e.target.value)}
          rows={5}
          placeholder="e.g. Independent authority on security selection... Requires approval for scheme objective changes..."
          className="input resize-y w-full"
        />
      </div>

      {/* Financials */}

      <div>
        <label className="text-sm font-semibold text-neutral-700">
          Financial Responsibility
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          <SmallField
            label="Budget Managed (₹)"
            value={bc.financials?.budget}
            onChange={(v) => updFinancials("budget", v)}
          />

          <SmallField
            label="Revenue Impact (₹)"
            value={bc.financials?.revenue}
            onChange={(v) => updFinancials("revenue", v)}
          />

          <SmallField
            label="AUM / Loan Book (₹)"
            value={bc.financials?.aum}
            onChange={(v) => updFinancials("aum", v)}
          />

          <SmallField
            label="Cost Ownership (₹)"
            value={bc.financials?.cost}
            onChange={(v) => updFinancials("cost", v)}
          />
        </div>
      </div>

      {bc.autoFilledFor && (
        <div className="mt-5 p-3 bg-info-light text-info-dark rounded-lg text-sm">
          ✨ Auto-filled from {bc.autoFilledFor.replace("::", " / ")} template.
          Edit freely.
        </div>
      )}
    </div>
  );
}

function SmallField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-1">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="input w-full"
      />
    </div>
  );
}

export default Step4_BusinessContext;
