import { useEffect, useRef, useState } from "react";

import { useJDStore } from "../store/useJDStore";

const AGENT_COLORS = {
  business: "#0066cc",

  hr: "#8B5CF6",

  finance: "#059669",

  jaeCoe: "#DC2626",
};

const AGENT_AVATARS = {
  business: "💼",

  hr: "👥",

  finance: "📊",

  jaeCoe: "⚖️",
};

const ROUND_LABELS = {
  1: "Opening",

  2: "Business View",

  3: "HR View",

  4: "Finance View",

  5: "Debate & Probes",

  6: "Agent Responses",

  7: "Final Verdict",
};

function CommitteeLive({ onBack, onFinished }) {
  const committee = useJDStore((s) => s.committee);

  const stopPolling = useJDStore((s) => s.stopPolling);

  const scrollRef = useRef(null);

  const [elapsedSec, setElapsedSec] = useState(0);

  // Cleanup polling when leaving screen

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  // Auto-scroll on new messages

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [committee?.transcript?.length]);

  // Auto-navigate to verdict when done

  useEffect(() => {
    if (committee?.status === "COMPLETED") {
      const timer = setTimeout(() => onFinished(), 2000);

      return () => clearTimeout(timer);
    }
  }, [committee?.status, onFinished]);

  // Elapsed time counter

  useEffect(() => {
    if (committee?.status === "COMPLETED" || committee?.status === "FAILED") {
      return;
    }

    const timer = setInterval(() => setElapsedSec((s) => s + 1), 1000);

    return () => clearInterval(timer);
  }, [committee?.status]);

  const transcript = committee?.transcript || [];

  const status = committee?.status || "PENDING";

  const currentRound =
    transcript.length > 0 ? transcript[transcript.length - 1].round : 0;

  // Progress percentage (7 rounds total, but some rounds emit multiple messages)

  const totalExpectedMessages = 11; // rough: 1 + 3 + 1 + 3 + 1 + 1 verdict + emit

  const progressPct = Math.min(
    Math.round((transcript.length / totalExpectedMessages) * 100),

    95,
  );

  return (
    <div
      style={{
        padding: "30px 40px",

        maxWidth: "950px",

        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onBack} style={btnSecondary}>
          ← Back
        </button>

        <button
          onClick={() => useJDStore.getState().pollCommittee()}
          style={btnSecondary}
        >
          🔄 Refresh
        </button>
      </div>

      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          marginTop: "15px",

          flexWrap: "wrap",

          gap: "10px",
        }}
      >
        <div>
          <h1 style={{ color: "#8B0000", margin: 0 }}>
            JAE Committee — Live Debate
          </h1>

          <p style={{ color: "#666", marginTop: "4px", fontSize: "14px" }}>
            Watch the 4-agent committee debate in real time
          </p>
        </div>

        <StatusBadge status={status} elapsedSec={elapsedSec} />
      </div>

      {/* Progress bar */}

      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            display: "flex",

            justifyContent: "space-between",

            fontSize: "12px",

            color: "#666",

            marginBottom: "5px",
          }}
        >
          <span>
            Round {currentRound || 0} / 7:{" "}
            {ROUND_LABELS[currentRound] || "Preparing..."}
          </span>

          <span>{progressPct}%</span>
        </div>

        <div
          style={{
            width: "100%",

            height: "6px",

            background: "#e5e7eb",

            borderRadius: "3px",

            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: progressPct + "%",

              height: "100%",

              background:
                status === "COMPLETED"
                  ? "#10b981"
                  : status === "FAILED"
                    ? "#dc2626"
                    : "#8B0000",

              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Agent status row */}

      <AgentStatusRow transcript={transcript} currentRound={currentRound} />

      {/* Debate scroll area */}

      <div ref={scrollRef} style={debateBox}>
        {transcript.length === 0 && <PreparingPanel />}

        {transcript.map((entry, i) => (
          <ChatBubble key={i} entry={entry} />
        ))}

        {status === "RUNNING" && transcript.length > 0 && <TypingIndicator />}
      </div>

      {status === "COMPLETED" && (
        <div style={successBox}>
          ✅ Committee has concluded. Redirecting to verdict...
        </div>
      )}

      {status === "FAILED" && (
        <div style={failBox}>
          ❌ Committee run failed. Please check backend logs and try again.
        </div>
      )}
    </div>
  );
}

// ============================================

// Sub-components

// ============================================

function PreparingPanel() {
  const steps = [
    { done: true, text: "Loading JD and dimensions" },
    { done: true, text: "Building role fact sheet (team, financials, stakeholders)" },
    { done: true, text: "Selecting agent personas (Business / HR / Finance / JAE COE)" },
    { done: true, text: "Loading Hay Guide Charts" },
    { done: true, text: "Connecting to Azure OpenAI..." },
    { done: false, text: "JAE COE preparing to open the committee" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          textAlign: "center",
          fontSize: "44px",
          marginBottom: "20px",
        }}
      >
        ⚖️
      </div>
      <div
        style={{
          textAlign: "center",
          color: "#333",
          fontSize: "15px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Preparing the JAE Committee
      </div>

      {steps.map((s, i) => (
        <div
          key={i}
          style={{
            padding: "10px 15px",
            background: s.done ? "#d1fae5" : "white",
            borderRadius: "6px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: s.done ? "#065f46" : "#666",
            border: s.done ? "1px solid #a7f3d0" : "1px solid #e5e7eb",
          }}
        >
          <span style={{ fontSize: "16px" }}>{s.done ? "✅" : "⏳"}</span>
          <span style={{ fontSize: "14px" }}>{s.text}</span>
        </div>
      ))}

      <div
        style={{
          textAlign: "center",
          color: "#666",
          marginTop: "20px",
          fontSize: "13px",
          fontStyle: "italic",
        }}
      >
        Typical completion: 30–60 seconds on Azure OpenAI
      </div>
    </div>
  );
}

function AgentStatusRow({ transcript }) {
  const spokenAgents = new Set(transcript.map((t) => t.agentKey));

  const agents = [
    { key: "jaeCoe", name: "JAE COE" },

    { key: "business", name: "Business" },

    { key: "hr", name: "HR" },

    { key: "finance", name: "Finance" },
  ];

  return (
    <div
      style={{
        display: "flex",

        gap: "10px",

        marginTop: "15px",

        marginBottom: "15px",

        flexWrap: "wrap",
      }}
    >
      {agents.map((a) => {
        const spoken = spokenAgents.has(a.key);

        const color = AGENT_COLORS[a.key];

        return (
          <div
            key={a.key}
            style={{
              display: "flex",

              alignItems: "center",

              gap: "6px",

              padding: "6px 12px",

              borderRadius: "20px",

              background: spoken ? color : "#f3f4f6",

              color: spoken ? "white" : "#999",

              fontSize: "12px",

              fontWeight: "bold",

              transition: "all 0.3s",
            }}
          >
            <span>{AGENT_AVATARS[a.key]}</span>

            <span>{a.name}</span>

            {spoken && <span>✓</span>}
          </div>
        );
      })}
    </div>
  );
}

function ChatBubble({ entry }) {
  const color = AGENT_COLORS[entry.agentKey] || "#666";

  const avatar = AGENT_AVATARS[entry.agentKey] || "🤖";

  const roundLabel = ROUND_LABELS[entry.round] || `Round ${entry.round}`;

  return (
    <div
      style={{
        display: "flex",

        gap: "12px",

        marginBottom: "20px",

        animation: "fadeIn 0.4s ease-in",
      }}
    >
      <div
        style={{
          width: "42px",

          height: "42px",

          borderRadius: "50%",

          background: color,

          color: "white",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          fontSize: "22px",

          flexShrink: 0,
        }}
      >
        {avatar}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",

            gap: "8px",

            alignItems: "baseline",

            flexWrap: "wrap",
          }}
        >
          <b style={{ color }}>{entry.agentName}</b>

          <span
            style={{
              fontSize: "11px",

              color: "#999",

              background: "#f3f4f6",

              padding: "2px 8px",

              borderRadius: "10px",
            }}
          >
            {roundLabel}
          </span>
        </div>

        <div
          style={{
            background: "white",

            padding: "12px 16px",

            borderRadius: "8px",

            borderLeft: "3px solid " + color,

            marginTop: "6px",

            lineHeight: 1.55,

            fontSize: "14px",

            whiteSpace: "pre-wrap",

            wordBreak: "break-word",

            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {entry.msg}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "10px",

        color: "#666",

        fontStyle: "italic",

        padding: "10px 15px",

        marginTop: "10px",
      }}
    >
      <div style={{ display: "flex", gap: "4px" }}>
        <Dot delay="0s" />

        <Dot delay="0.2s" />

        <Dot delay="0.4s" />
      </div>

      <span style={{ fontSize: "13px" }}>Committee is thinking...</span>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span
      style={{
        width: "8px",

        height: "8px",

        borderRadius: "50%",

        background: "#8B0000",

        animation: `bounce 1.2s infinite ${delay}`,
      }}
    />
  );
}

function StatusBadge({ status, elapsedSec }) {
  const map = {
    PENDING: { bg: "#fef3c7", color: "#92400e", label: "Pending" },

    RUNNING: { bg: "#dbeafe", color: "#1e40af", label: "In Progress" },

    COMPLETED: { bg: "#d1fae5", color: "#065f46", label: "Completed" },

    FAILED: { bg: "#fee2e2", color: "#991b1b", label: "Failed" },
  };

  const s = map[status] || map.PENDING;

  const showTimer = status === "RUNNING" || status === "PENDING";

  return (
    <div
      style={{
        display: "flex",

        alignItems: "center",

        gap: "10px",
      }}
    >
      {showTimer && (
        <span
          style={{
            fontSize: "13px",

            color: "#666",

            fontFamily: "monospace",
          }}
        >
          ⏱ {formatTime(elapsedSec)}
        </span>
      )}

      <span
        style={{
          background: s.bg,

          color: s.color,

          padding: "6px 14px",

          borderRadius: "14px",

          fontSize: "12px",

          fontWeight: "bold",
        }}
      >
        {s.label}
      </span>
    </div>
  );
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);

  const s = sec % 60;

  return m + ":" + String(s).padStart(2, "0");
}

// ============================================

// Inject keyframe animations once

// ============================================

if (
  typeof document !== "undefined" &&
  !document.getElementById("committee-live-anims")
) {
  const styleEl = document.createElement("style");

  styleEl.id = "committee-live-anims";

  styleEl.textContent = `

    @keyframes fadeIn {

      from { opacity: 0; transform: translateY(8px); }

      to { opacity: 1; transform: translateY(0); }

    }

    @keyframes bounce {

      0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }

      30% { transform: translateY(-6px); opacity: 1; }

    }

  `;

  document.head.appendChild(styleEl);
}

// ============================================

// Styles

// ============================================

const debateBox = {
  background: "#f9fafb",

  borderRadius: "8px",

  padding: "20px",

  minHeight: "400px",

  maxHeight: "600px",

  overflowY: "auto",

  border: "1px solid #eee",

  marginTop: "10px",
};

const successBox = {
  marginTop: "20px",

  padding: "15px",

  background: "#d1fae5",

  color: "#065f46",

  borderRadius: "6px",

  fontWeight: "bold",

  textAlign: "center",
};

const failBox = {
  marginTop: "20px",

  padding: "15px",

  background: "#fee2e2",

  color: "#991b1b",

  borderRadius: "6px",

  textAlign: "center",
};

const btnSecondary = {
  padding: "8px 16px",

  background: "#f3f4f6",

  border: "1px solid #d1d5db",

  borderRadius: "6px",

  cursor: "pointer",

  color: "#333",
};

export default CommitteeLive;
