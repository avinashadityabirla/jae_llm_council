import { useJDStore } from "../store/useJDStore";

import Card from "./ui/Card";

import Button from "./ui/Button";

function CommitteeVerdict({ onBack }) {
  const committee = useJDStore((s) => s.committee);

  const downloadCommitteeReport = useJDStore((s) => s.downloadCommitteeReport);

  const wizardData = useJDStore((s) => s.wizardData);

  const v = committee?.finalVerdict || {};

  const b = wizardData?.basic || {};

  // Band comparison logic

  const targetBand = b.band || "";

  const recommendedBand = v.recommendedBand || v.computedBand || "";

  const bandMatches =
    targetBand && recommendedBand && targetBand === recommendedBand;

  const hasBandComparison = targetBand && recommendedBand;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="btn-secondary text-sm">
          ← Back to Dashboard
        </button>

        <Button variant="success" onClick={downloadCommitteeReport} icon="📄">
          Download PDF Report
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-abc-red">
          JAE Committee Verdict
        </h1>

        <p className="text-sm text-neutral-500 mt-1">
          {b.designation || "Untitled"} · {b.lob || "-"} · {b.department || "-"}
        </p>
      </div>

      {/* Top KPI Row */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="card p-6 border-l-4 border-abc-red">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Recommended Band
          </div>

          <div className="text-4xl font-bold text-abc-red mt-2">
            {recommendedBand || "-"}
          </div>

          <div className="text-xs text-neutral-400 mt-1">
            Computed from Hay Guide Chart
          </div>
        </div>

        <div className="card p-6 border-l-4 border-info">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Hay Points
          </div>

          <div className="text-4xl font-bold text-info mt-2">
            {v.totalPoints || "-"}
          </div>

          <div className="text-xs text-neutral-400 mt-1">
            KH + PS + Accountability
          </div>
        </div>

        <div className="card p-6 border-l-4 border-neutral-400">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Target Band (HR input)
          </div>

          <div className="text-4xl font-bold text-neutral-600 mt-2">
            {targetBand || "-"}
          </div>

          <div className="text-xs text-neutral-400 mt-1">What HR expected</div>
        </div>
      </div>

      {/* Band Consistency Banner */}

      {hasBandComparison && (
        <div
          className={
            "rounded-lg p-4 mb-6 flex items-center gap-3 " +
            (bandMatches
              ? "bg-success-light text-success-dark"
              : "bg-warning-light text-warning-dark")
          }
        >
          <span className="text-xl">{bandMatches ? "✅" : "⚠️"}</span>

          <div>
            {bandMatches ? (
              <span className="text-sm font-medium">
                Committee's Hay evaluation matches HR's target band (
                {targetBand}). Strong alignment.
              </span>
            ) : (
              <span className="text-sm font-medium">
                Committee's Hay evaluation ({recommendedBand}) differs from HR's
                target ({targetBand}). Review the factor reasoning below to
                understand the gap.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Executive Summary */}

      <Card title="Committee Summary" className="mb-6">
        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
          {v.summaryVerdict || v.committeeSummary || "No summary available."}
        </p>
      </Card>

      {/* Hay Factor Breakdown */}

      <Card
        title="Hay Factor Breakdown"
        subtitle="How the committee scored each factor"
        className="mb-6"
      >
        <div className="space-y-4">
          <FactorRow
            title="1. Know-How"
            color="#0066cc"
            points={v.knowHow?.points}
            items={[
              ["Practical Knowledge", v.knowHow?.practical],

              ["Managerial Breadth", v.knowHow?.managerial],

              ["Human Relations", v.knowHow?.humanRelations],
            ]}
            reasoning={v.knowHow?.reasoning}
          />

          <FactorRow
            title="2. Problem Solving"
            color="#8B5CF6"
            points={v.problemSolving?.points}
            extraTag={
              v.problemSolving?.percentage
                ? v.problemSolving.percentage + "% of Know-How"
                : null
            }
            items={[
              ["Thinking Environment", v.problemSolving?.environment],

              ["Thinking Challenge", v.problemSolving?.challenge],
            ]}
            reasoning={v.problemSolving?.reasoning}
          />

          <FactorRow
            title="3. Accountability"
            color="#059669"
            points={v.accountability?.points}
            items={[
              ["Freedom to Act", v.accountability?.freedomToAct],

              ["Magnitude", v.accountability?.magnitude],

              ["Impact", v.accountability?.impact],
            ]}
            reasoning={v.accountability?.reasoning}
          />
        </div>

        {/* Points Formula */}

        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-sm">
          <span className="text-neutral-500">
            {v.knowHow?.points || 0} + {v.problemSolving?.points || 0} +{" "}
            {v.accountability?.points || 0}
          </span>

          <span className="font-bold text-neutral-900">
            = {v.totalPoints || 0} points → {recommendedBand || "-"}
          </span>
        </div>
      </Card>

      {/* Committee Transcript */}

      <Card
        title="Committee Debate Transcript"
        subtitle={`${(committee?.transcript || []).length} messages`}
      >
        <div className="space-y-4">
          {(committee?.transcript || []).map((entry, i) => (
            <TranscriptEntry key={i} entry={entry} />
          ))}

          {(committee?.transcript || []).length === 0 && (
            <div className="text-sm text-neutral-400 italic text-center py-8">
              No transcript available.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function FactorRow({ title, color, points, items, reasoning, extraTag }) {
  return (
    <div
      className="rounded-lg p-4 bg-neutral-50"
      style={{ borderLeft: "4px solid " + color }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm" style={{ color }}>
          {title}
        </h4>

        <div className="flex items-center gap-2">
          {extraTag && (
            <span className="text-xs text-neutral-500 bg-white px-2 py-0.5 rounded-full border border-neutral-200">
              {extraTag}
            </span>
          )}

          <span
            className="text-sm font-bold px-3 py-1 rounded-full text-white"
            style={{ background: color }}
          >
            {points || 0} pts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        {items.map(([label, val], i) => (
          <div
            key={i}
            className="bg-white rounded-md p-2 text-center border border-neutral-200"
          >
            <div className="text-xs text-neutral-500">{label}</div>

            <div className="text-lg font-bold text-neutral-900 mt-1">
              {val || "-"}
            </div>
          </div>
        ))}
      </div>

      {reasoning && (
        <div className="text-xs text-neutral-600 italic bg-white rounded-md p-2 border border-neutral-100">
          {reasoning}
        </div>
      )}
    </div>
  );
}

const AGENT_STYLES = {
  business: { color: "#0066cc", icon: "💼" },

  hr: { color: "#8B5CF6", icon: "👥" },

  finance: { color: "#059669", icon: "📊" },

  jaeCoe: { color: "#DC2626", icon: "⚖️" },
};

function TranscriptEntry({ entry }) {
  const style = AGENT_STYLES[entry.agentKey] || {
    color: "#6B7280",
    icon: "🤖",
  };

  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm"
        style={{ background: style.color }}
      >
        {style.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold"
            style={{ color: style.color }}
          >
            {entry.agentName}
          </span>

          <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
            Round {entry.round}
          </span>
        </div>

        <div
          className="text-sm text-neutral-700 mt-1 whitespace-pre-wrap leading-relaxed rounded-lg p-3 bg-neutral-50"
          style={{ borderLeft: "3px solid " + style.color }}
        >
          {entry.msg}
        </div>
      </div>
    </div>
  );
}

export default CommitteeVerdict;
