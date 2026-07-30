import { useState } from "react";

import MicButton from "../ui/MicButton";

const BANDS = [
  "JB 1",
  "JB 2",
  "JB 3",
  "JB 4",
  "JB 5",
  "JB 6",
  "JB 7",
  "JB 8",
  "JB 9",
  "JB 10",
];

const COMMON_DEPARTMENTS = [
  "Investments",
  "Sales & Distribution",
  "Operations",
  "Compliance",

  "Digital",
  "Finance",
  "HR",
  "Technology",
  "Risk",
  "Marketing",

  "Legal",
  "Credit",
  "Collections",
  "Branch Banking",
];

function Step7_DirectReports({ data, onChange, basic }) {
  const managerAbove = data?.managerAbove || {
    name: "",
    band: "",
    department: "",
  };

  const reportees = data?.reportees || [];

  const hasNoReportees = data?.hasNoReportees || false;

  const orgRelationships = data?.orgRelationships || "";

  const b = basic || {};

  const thisRoleName = b.designation || b.positionTitle || "This Role";

  const thisRoleBand = b.band || "-";

  const thisRoleDept = b.department || "-";

  const pushUp = (patch) => {
    onChange({
      managerAbove,

      reportees,

      hasNoReportees,

      orgRelationships,

      ...patch,
    });
  };

  const saveManager = (newManager) => {
    pushUp({ managerAbove: newManager });
  };

  const addReportee = () => {
    if (hasNoReportees) return;

    pushUp({
      reportees: [...reportees, { department: "", band: "", count: 1 }],
    });
  };

  const updateReportee = (index, field, value) => {
    if (hasNoReportees) return;

    const updated = reportees.map((r, i) => {
      if (i !== index) return r;

      const copy = { ...r };

      copy[field] = field === "count" ? Number(value) || 1 : value;

      return copy;
    });

    pushUp({ reportees: updated });
  };

  const removeReportee = (index) => {
    if (hasNoReportees) return;

    pushUp({ reportees: reportees.filter((_, i) => i !== index) });
  };

  const toggleNoReportees = (checked) => {
    pushUp({ hasNoReportees: checked });
  };

  const updateOrgRel = (v) => {
    pushUp({ orgRelationships: v });
  };

  const effectiveReporteeCount = hasNoReportees
    ? 0
    : reportees.reduce((s, r) => s + (Number(r.count) || 0), 0);

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-1">
        Step 7 — Reporting Structure
      </h2>

      <p className="text-sm text-neutral-500 mb-4">
        Draw the org hierarchy: who this role reports to, and who reports into
        this role.
      </p>

      {/* No Reportees Toggle */}

      <div className="mb-6 p-4 bg-neutral-100 rounded-lg border border-neutral-200">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasNoReportees}
            onChange={(e) => toggleNoReportees(e.target.checked)}
            className="w-4 h-4 accent-abc-red"
          />

          <div>
            <div className="text-sm font-semibold text-neutral-900">
              This role has NO direct reportees (Individual Contributor)
            </div>

            <div className="text-xs text-neutral-500 mt-0.5">
              When checked, the reportees section is disabled and excluded from
              JD generation and JAE committee evaluation.
            </div>
          </div>
        </label>
      </div>

      {/* Total Summary */}

      {!hasNoReportees && (
        <div className="mb-4 flex items-center gap-4 text-sm">
          <span className="text-neutral-500">Total reportees:</span>

          <span className="badge bg-abc-red text-white">
            {effectiveReporteeCount} people
          </span>

          <span className="text-neutral-500">across</span>

          <span className="badge bg-info-light text-info-dark">
            {reportees.length} group{reportees.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {/* ORG CHART */}

      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 mb-8">
        <div className="flex justify-center mb-2">
          <ManagerBox manager={managerAbove} onSave={saveManager} />
        </div>

        <div className="flex justify-center">
          <div className="w-0.5 h-8 bg-neutral-300"></div>
        </div>

        <div className="flex justify-center mb-2">
          <ThisRoleBox
            name={thisRoleName}
            band={thisRoleBand}
            department={thisRoleDept}
          />
        </div>

        {hasNoReportees ? (
          <div className="mt-6 p-8 bg-neutral-200 bg-opacity-40 rounded-lg border-2 border-dashed border-neutral-300 text-center">
            <div className="text-4xl mb-2 opacity-40">🚫</div>

            <div className="text-sm font-medium text-neutral-500">
              Reportees Section Disabled
            </div>

            <div className="text-xs text-neutral-400 mt-1">
              This role is marked Individual Contributor. Uncheck the box above
              to add reportees.
            </div>
          </div>
        ) : (
          <>
            {reportees.length > 0 && (
              <>
                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-neutral-300"></div>
                </div>

                <HorizontalConnector count={reportees.length} />
              </>
            )}

            {reportees.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {reportees.map((r, i) => (
                  <ReporteeBox
                    key={i}
                    reportee={r}
                    index={i}
                    onChange={(field, val) => updateReportee(i, field, val)}
                    onRemove={() => removeReportee(i)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center mt-4">
                <div className="text-sm text-neutral-400 italic">
                  No reportees added yet — click below
                </div>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={addReportee}
                className="px-5 py-2 bg-abc-red text-white rounded-lg font-medium text-sm hover:bg-abc-red-hover flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span>
                Add Reportee Group
              </button>
            </div>
          </>
        )}
      </div>

      {/* Organizational Relationships */}

      <div className="mt-8">
        <label className="block text-sm font-semibold text-neutral-700 mb-1">
          Organizational Relationships (Optional)
        </label>

        <p className="text-xs text-neutral-500 mb-2">
          Any additional org context (matrix reporting, dotted lines, cross-BU
          collaboration, etc.)
        </p>

        <textarea
          value={orgRelationships}
          onChange={(e) => updateOrgRel(e.target.value)}
          rows={4}
          placeholder="e.g. Dotted line reporting to Chief Risk Officer for governance matters..."
          className="input resize-y"
        />
      </div>
    </div>
  );
}

// ============================================

// MANAGER BOX — uses LOCAL state for editing (typing always works)

// ============================================

function ManagerBox({ manager, onSave }) {
  const [editing, setEditing] = useState(!manager.name);

  const [name, setName] = useState(manager.name || "");

  const [band, setBand] = useState(manager.band || "");

  const [department, setDepartment] = useState(manager.department || "");

  const handleDone = () => {
    onSave({ name, band, department });

    setEditing(false);
  };

  const handleEdit = () => {
    // Sync local state from props when entering edit

    setName(manager.name || "");

    setBand(manager.band || "");

    setDepartment(manager.department || "");

    setEditing(true);
  };

  if (!editing) {
    return (
      <div
        onClick={handleEdit}
        className="w-64 bg-neutral-900 text-white rounded-lg p-4 shadow-md cursor-pointer hover:bg-neutral-800 transition-colors border-2 border-neutral-900"
      >
        <div className="text-xs uppercase tracking-wider text-neutral-400 mb-1">
          Reports To
        </div>

        <div className="font-semibold text-sm mb-1">
          {manager.name || "Manager Name"}
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <span className="bg-abc-gold text-neutral-900 px-2 py-0.5 rounded font-bold">
            {manager.band || "Band"}
          </span>

          <span>{manager.department || "Department"}</span>
        </div>

        <div className="text-xs text-neutral-400 mt-2 italic">
          Click to edit
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-neutral-900 text-white rounded-lg p-4 shadow-md border-2 border-abc-gold">
      <div className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
        Reports To (Manager)
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Manager Name"
        className="w-full px-2 py-1 rounded text-neutral-900 text-sm mb-2"
      />

      <div className="grid grid-cols-2 gap-2 mb-2">
        <select
          value={band}
          onChange={(e) => setBand(e.target.value)}
          className="px-2 py-1 rounded text-neutral-900 text-xs"
        >
          <option value="">Band...</option>

          {BANDS.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="Department"
          className="px-2 py-1 rounded text-neutral-900 text-xs"
          list="mgr-depts"
        />

        <datalist id="mgr-depts">
          {COMMON_DEPARTMENTS.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>
      </div>

      <button
        onClick={handleDone}
        className="w-full bg-abc-gold text-neutral-900 rounded py-1 text-xs font-bold hover:bg-abc-gold-light"
      >
        Done
      </button>
    </div>
  );
}

// ============================================

// THIS ROLE BOX

// ============================================

function ThisRoleBox({ name, band, department }) {
  return (
    <div className="w-72 bg-abc-red text-white rounded-lg p-5 shadow-lg border-2 border-abc-red">
      <div className="text-xs uppercase tracking-wider text-white opacity-80 mb-1">
        This Role
      </div>

      <div className="font-bold text-base mb-2">{name}</div>

      <div className="flex items-center gap-2 text-xs">
        <span className="bg-abc-gold text-neutral-900 px-2 py-0.5 rounded font-bold">
          {band}
        </span>

        <span className="opacity-90">{department}</span>
      </div>
    </div>
  );
}

// ============================================

// REPORTEE BOX

// ============================================

function ReporteeBox({ reportee, index, onChange, onRemove }) {
  return (
    <div className="w-52 bg-white rounded-lg p-3 shadow-md border-2 border-neutral-200 relative">
      <button
        onClick={onRemove}
        title="Remove"
        className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full text-xs font-bold hover:opacity-80 shadow-md"
      >
        ×
      </button>

      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
        Reportee Group {index + 1}
      </div>

      <label className="block text-xs font-medium text-neutral-600 mb-1">
        Department
      </label>

      <input
        value={reportee.department || ""}
        onChange={(e) => onChange("department", e.target.value)}
        placeholder="e.g. Equity"
        className="w-full px-2 py-1 border border-neutral-300 rounded text-xs mb-2"
        list={`dept-list-${index}`}
      />

      <datalist id={`dept-list-${index}`}>
        {COMMON_DEPARTMENTS.map((d) => (
          <option key={d} value={d} />
        ))}
      </datalist>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Band
          </label>

          <select
            value={reportee.band || ""}
            onChange={(e) => onChange("band", e.target.value)}
            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs bg-white"
          >
            <option value="">-</option>

            {BANDS.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">
            Count
          </label>

          <input
            type="number"
            min="1"
            value={reportee.count}
            onChange={(e) => onChange("count", e.target.value)}
            className="w-full px-2 py-1 border border-neutral-300 rounded text-xs"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================

// Horizontal connector

// ============================================

function HorizontalConnector({ count }) {
  if (count <= 1) {
    return <div className="w-0.5 h-6 bg-neutral-300 mx-auto"></div>;
  }

  const width = Math.min(count * 220, 900);

  return (
    <div className="flex justify-center">
      <div
        className="relative border-t-2 border-neutral-300"
        style={{ width: width + "px" }}
      >
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-6 bg-neutral-300"
            style={{
              left: (i / (count - 1 || 1)) * 100 + "%",

              transform: "translateX(-50%)",

              top: "0",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Step7_DirectReports;
