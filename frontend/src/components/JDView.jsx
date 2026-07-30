import { useJDStore } from "../store/useJDStore";

import Card from "./ui/Card";

import Button from "./ui/Button";

function JDView({ onBack, onEdit }) {
  const wizardData = useJDStore((s) => s.wizardData);

  const generatedJd = useJDStore((s) => s.generatedJd);

  const currentJdStatus = useJDStore((s) => s.currentJdStatus);

  const downloadJD = useJDStore((s) => s.downloadJD);

  const reopenJd = useJDStore((s) => s.reopenJd);

  const b = wizardData?.basic || {};

  const g = generatedJd || {};

  const handleEdit = async () => {
    if (currentJdStatus === "FINALIZED") await reopenJd();

    onEdit();
  };

  const splitLines = (text) =>
    !text
      ? []
      : String(text)
          .split(/\n+/)
          .map((s) =>
            s
              .replace(/^\s*[\d]+[\.\)]\s*/, "")
              .replace(/^[-•]\s*/, "")
              .trim(),
          )
          .filter(Boolean);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn-secondary text-sm">
          ← Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleEdit} icon="✏️">
            {currentJdStatus === "FINALIZED" ? "Re-open & Edit" : "Edit JD"}
          </Button>

          <Button variant="success" onClick={downloadJD} icon="📄">
            Download Word
          </Button>
        </div>
      </div>

      <div className="card p-6 mb-6 border-l-4 border-abc-red">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {b.designation || "Untitled Role"}
            </h1>

            <p className="text-sm text-neutral-500 mt-1">
              {b.lob || "-"} · {b.department || "-"} · Band {b.band || "-"}
            </p>
          </div>

          <StatusBadge status={currentJdStatus} />
        </div>
      </div>

      <Card title="Basic Details" className="mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <Field label="Business" value={b.business} />

          <Field label="Unit" value={b.unit} />

          <Field label="Location" value={b.location} />

          <Field label="Position Title" value={b.positionTitle} />

          <Field label="Function" value={b.function} />

          <Field label="Department" value={b.department} />

          <Field label="Designation" value={b.designation} />

          <Field label="Manager Designation" value={b.managerDesignation} />

          <Field label="Band" value={b.band} />

          <Field label="Date" value={b.date} />
        </div>
      </Card>

      <Card title="Job Purpose" className="mb-5">
        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
          {g.jobPurpose || wizardData.jobPurpose || "Not generated"}
        </p>
      </Card>

      {(wizardData.dimensions || []).length > 0 && (
        <Card title="Dimensions" className="mb-5" padding="sm">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
              <tr>
                <th className="text-left px-4 py-2">S.No</th>

                <th className="text-left px-4 py-2">Dimension</th>

                <th className="text-left px-4 py-2">FY Prev</th>

                <th className="text-left px-4 py-2">FY Curr</th>

                <th className="text-left px-4 py-2">Remarks</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-100">
              {wizardData.dimensions.map((d, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{i + 1}</td>

                  <td className="px-4 py-2 font-medium">{d.name}</td>

                  <td className="px-4 py-2">{d.fyPrevious}</td>

                  <td className="px-4 py-2">{d.fyCurrent}</td>

                  <td className="px-4 py-2 text-neutral-500">{d.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card title="Job Context & Major Challenges" className="mb-5">
        {(g.orgContext || wizardData.orgContext) && (
          <>
            <h4 className="text-sm font-semibold text-neutral-800 underline mb-1">
              Organisation Context
            </h4>

            <p className="text-sm text-neutral-700 mb-4 whitespace-pre-wrap">
              {g.orgContext || wizardData.orgContext}
            </p>
          </>
        )}

        <h4 className="text-sm font-semibold text-neutral-800 underline mb-1">
          Job Context
        </h4>

        <ul className="list-disc ml-5 text-sm text-neutral-700 mb-4">
          {splitLines(g.jobContext || wizardData.jobContext).map((t, i) => (
            <li key={i} className="mb-1">
              {t}
            </li>
          ))}
        </ul>

        <h4 className="text-sm font-semibold text-neutral-800 underline mb-1">
          Key Challenges
        </h4>

        <ul className="list-disc ml-5 text-sm text-neutral-700 font-medium">
          {splitLines(g.challenges).map((t, i) => (
            <li key={i} className="mb-1">
              {t}
            </li>
          ))}
        </ul>
      </Card>

      {(g.accountabilities || []).length > 0 && (
        <Card title="Principal Accountabilities" className="mb-5">
          {g.accountabilities.map((a, i) => (
            <div key={i} className="mb-4">
              <div className="font-semibold text-sm text-neutral-900 mb-1">
                {a.accountability}
              </div>

              <ul className="list-disc ml-5 text-sm text-neutral-700">
                {(a.actions || []).map((act, j) => (
                  <li key={j} className="mb-1">
                    {act}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>
      )}

      <Card title="Reporting Structure" className="mb-5">
        {wizardData.managerAbove?.name && (
          <p className="text-sm text-neutral-700 mb-2">
            <b>Reports to:</b> {wizardData.managerAbove.name} (
            {wizardData.managerAbove.band} ·{" "}
            {wizardData.managerAbove.department})
          </p>
        )}

        {wizardData.hasNoReportees ? (
          <p className="text-sm text-neutral-500 italic">
            Individual Contributor — no direct reportees
          </p>
        ) : (wizardData.reportees || []).length > 0 ? (
          <div className="text-sm text-neutral-700">
            <b>Direct reportees:</b>

            <ul className="list-disc ml-5 mt-1">
              {wizardData.reportees.map((r, i) => (
                <li key={i}>
                  {r.count} × {r.band} in {r.department}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-neutral-400 italic">
            No reportees specified
          </p>
        )}
      </Card>

      {(wizardData.relationships?.internal?.length > 0 ||
        wizardData.relationships?.external?.length > 0) && (
        <Card title="Relationships" className="mb-5">
          {wizardData.relationships.internal?.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-neutral-800 mb-2">
                Internal
              </h4>

              <RelTable rows={wizardData.relationships.internal} />
            </>
          )}

          {wizardData.relationships.external?.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-neutral-800 mb-2 mt-4">
                External
              </h4>

              <RelTable rows={wizardData.relationships.external} />
            </>
          )}
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="flex justify-between border-b border-neutral-100 pb-1.5">
      <span className="text-neutral-500">{label}</span>

      <span className="font-medium text-neutral-900 text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function RelTable({ rows }) {
  return (
    <table className="w-full text-sm mb-2">
      <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
        <tr>
          <th className="text-left px-3 py-1.5">Relationship</th>

          <th className="text-left px-3 py-1.5">Frequency</th>

          <th className="text-left px-3 py-1.5">Nature</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-neutral-100">
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="px-3 py-1.5">{r.type}</td>

            <td className="px-3 py-1.5">{r.frequency}</td>

            <td className="px-3 py-1.5 text-neutral-500">{r.nature}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StatusBadge({ status }) {
  const map = {
    DRAFT: "bg-warning-light text-warning-dark",
    FINALIZED: "bg-success-light text-success-dark",
  };

  return (
    <span className={`badge ${map[status] || map.DRAFT}`}>
      {status === "FINALIZED" ? "✓ FINALIZED" : status}
    </span>
  );
}

export default JDView;
