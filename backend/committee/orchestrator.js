// backend/committee/orchestrator.js

// Optimized 6-round debate — parallel where possible, terse prompts

import { createAgent, agentSpeak, parseJSON } from "../agents/agentRunner.js";

import {
  buildBusinessSystemPrompt,
  getBusinessPersona,
} from "../agents/prompts/businessAgent.js";

import { buildHRSystemPrompt } from "../agents/prompts/hrAgent.js";

import { buildFinanceSystemPrompt } from "../agents/prompts/financeAgent.js";

import { buildJAECoESystemPrompt } from "../agents/prompts/jaeCoeAgent.js";

import {
  computeKnowHow,
  computeProblemSolving,
  computeAccountability,
  mapBand,
} from "./hayCharts.js";

function summarizeJD(wizardData, generated) {
  const b = wizardData?.basic || {};

  const bc = wizardData?.businessContext || {};

  const g = generated || {};

  const dimsLine = (wizardData?.dimensions || [])

    .map((d) => `- ${d.name}: ${d.fyCurrent || ""}`)
    .join("\n");

  const challengesText =
    g.challenges ||
    (Array.isArray(wizardData?.challenges)
      ? wizardData.challenges.join("\n")
      : "Not provided");

  const accountabilitiesText = (g.accountabilities || [])

    .map((a) => `- ${a.accountability}: ${(a.actions || []).join("; ")}`)
    .join("\n");

  const bcBlock = bc.rolePurpose
    ? `


BUSINESS CONTEXT (provided by HR):

- Why role exists: ${bc.rolePurpose}

- Expected outcomes: ${(bc.outcomes || []).join(", ")}

- Decision authority: ${bc.decisionAuthority}

- Financial scale: Budget=${bc.financials?.budget || "N/A"}, Revenue=${bc.financials?.revenue || "N/A"}, AUM=${bc.financials?.aum || "N/A"}, Cost=${bc.financials?.cost || "N/A"}`
    : "";

  const reporteeSummary = wizardData?.hasNoReportees
    ? "REPORTING SCOPE: Individual Contributor — no direct reportees."
    : (wizardData?.reportees || []).length === 0
      ? "REPORTING SCOPE: Not specified."
      : "REPORTING SCOPE:\n" +
        (wizardData.reportees || [])

          .map(
            (r) =>
              `- ${r.count} people at ${r.band || "unknown band"} in ${r.department || "unknown dept"}`,
          )

          .join("\n");

  return `ROLE: ${b.designation || "N/A"} | LOB: ${b.lob || "N/A"} | Department: ${b.department || "N/A"} | Target Band: ${b.band || "N/A"}

Business: ${b.business || "N/A"} | Reports To: ${b.reportsTo || b.reportsToTitle || "N/A"}

${bcBlock}


JOB PURPOSE:

${g.jobPurpose || wizardData?.jobPurpose || "Not provided"}


KEY DIMENSIONS:

${dimsLine || "None provided"}


JOB CONTEXT:

${g.jobContext || wizardData?.jobContext || "Not provided"}


KEY CHALLENGES:

${challengesText || "Not provided"}


PRINCIPAL ACCOUNTABILITIES:

${reporteeSummary}

${accountabilitiesText || "Not provided"}`;
}

function summarizeNuances(nuances) {
  if (!nuances) return "None provided.";

  const parts = [];

  if (nuances.context) parts.push("Special Context: " + nuances.context);

  if (nuances.history) parts.push("Historical Context: " + nuances.history);

  if (nuances.comparableRoles)
    parts.push("Comparable Roles: " + nuances.comparableRoles);

  if (nuances.notes) parts.push("Points to Note: " + nuances.notes);

  return parts.length > 0 ? parts.join("\n") : "None provided.";
}

// Main orchestration — emits messages via callback as they're generated

export async function runCommittee(jd, generated, nuances, onMessage) {
  const b = jd.wizardData?.basic || {};

  const lob = b.lob || "AMC";

  const department = b.department || "General";

  // Create agents (one Ollama, four personas)

  const businessPersona = getBusinessPersona(lob, department);

  const agents = {
    business: createAgent(
      "business",

      buildBusinessSystemPrompt(lob, department),
    ),

    hr: createAgent("hr", buildHRSystemPrompt(lob, department)),

    finance: createAgent("finance", buildFinanceSystemPrompt(lob, department)),

    jaeCoe: createAgent("jaeCoe", buildJAECoESystemPrompt(lob)),
  };

  const agentNames = {
    business: businessPersona.role,

    hr: "HR Business Partner",

    finance: "Finance Business Partner",

    jaeCoe: "JAE COE Facilitator",
  };

  const transcript = [];

  const jdSummary = summarizeJD(jd.wizardData || {}, generated);

  const nuancesSummary = summarizeNuances(nuances);

  const emit = async (agentKey, msg, round) => {
    const entry = {
      agentKey,

      agentName: agentNames[agentKey],

      msg,

      round,

      ts: Date.now(),
    };

    transcript.push(entry);

    if (onMessage) await onMessage(entry);
  };

  // ============================================

  // ROUND 1 — JAE COE opens the committee

  // ============================================

  const opening = await agentSpeak(
    agents.jaeCoe,

    `Open this JAE committee for the following role.


${jdSummary}


NUANCES FROM HR TEAM:

${nuancesSummary}


Give a brief 2-3 sentence opening: welcome the committee, state the role and target band, and note any nuances. UNDER 70 WORDS.`,

    [],
  );

  await emit("jaeCoe", opening, 1);

  // ============================================

  // ROUNDS 2-4 — All 3 agents present in PARALLEL

  // Each sees the JAE COE opening as shared context

  // ============================================

  const [businessView, hrView, financeView] = await Promise.all([
    agentSpeak(
      agents.business,

      `Present your view on this role. Focus on:

- Business impact and market context

- Whether the role warrants ${b.band || "the target band"} based on scope

- Your initial view on Accountability (Freedom to Act, Magnitude, Impact type)


Speak in first person as ${businessPersona.role}. 2-3 sentences MAX. UNDER 80 WORDS.`,

      transcript,
    ),

    agentSpeak(
      agents.hr,

      `Present your view. Focus on:

- Managerial Know-How (team scope, function integration)

- Human Relations complexity

- Parity with comparable ABCL roles at ${b.band || "target band"}

- Push back if Business is likely to overstate


2-3 sentences MAX. UNDER 80 WORDS.`,

      transcript,
    ),

    agentSpeak(
      agents.finance,

      `Present your view. Focus on:

- Accountability rigor — is Magnitude quantified and genuinely owned?

- Freedom to Act — what is the actual authority in Rupees?

- Impact type — Primary / Shared / Contributory

- Cite specific dimensions from the JD


2-3 sentences MAX. UNDER 80 WORDS.`,

      transcript,
    ),
  ]);

  await emit("business", businessView, 2);

  await emit("hr", hrView, 3);

  await emit("finance", financeView, 4);

  // ============================================

  // ROUND 5 — JAE COE surfaces disagreements

  // ============================================

  const debate = await agentSpeak(
    agents.jaeCoe,

    `Summarize the 3 views above. Identify 1-2 KEY DISAGREEMENTS or gaps in evidence. Ask specific probing questions.


3-4 sentences. UNDER 100 WORDS.`,

    transcript,
  );

  await emit("jaeCoe", debate, 5);

  // ============================================

  // ROUND 6 — All 3 agents respond in PARALLEL

  // ============================================

  const [businessResponse, hrResponse, financeResponse] = await Promise.all([
    agentSpeak(
      agents.business,

      `Respond to JAE COE's probing questions. Defend or refine your position. 2 sentences MAX. UNDER 60 WORDS.`,

      transcript,
    ),

    agentSpeak(
      agents.hr,

      `Respond to JAE COE's probing questions. Defend or refine your position. 2 sentences MAX. UNDER 60 WORDS.`,

      transcript,
    ),

    agentSpeak(
      agents.finance,

      `Respond to JAE COE's probing questions. Defend or refine your position. 2 sentences MAX. UNDER 60 WORDS.`,

      transcript,
    ),
  ]);

  await emit("business", businessResponse, 6);

  await emit("hr", hrResponse, 6);

  await emit("finance", financeResponse, 6);

  // ============================================

  // ROUND 7 — JAE COE gives final verdict with structured Hay scores

  // ============================================

  const verdictRaw = await agentSpeak(
    agents.jaeCoe,

    `Based on the full committee discussion, produce your final Hay factor recommendation.


REMEMBER:

- You do NOT recommend a Job Band.

- You recommend ONLY Hay factors.

- Be evidence-based, not prestige-based.

- Anti-inflation is your default.


Return this EXACT JSON schema:


{

  "knowHow": {

    "practical": "single letter A-H",

    "managerial": "T, I, II, III, or IV",

    "humanRelations": "1, 2, or 3",

    "reasoning": "1-2 sentences with evidence"

  },

  "problemSolving": {

    "environment": "A-H",

    "challenge": "1-5",

    "reasoning": "1-2 sentences with evidence"

  },

  "accountability": {

    "freedomToAct": "A-H",

    "magnitude": "1-6",

    "impact": "R, C, S, or P",

    "reasoning": "1-2 sentences with evidence"

  },

  "committeeSummary": "3-4 sentences summarizing the debate and evidence-based consensus"

}


Return ONLY the JSON. No preamble. No markdown fences. No mention of any Job Band.`,

    transcript,
  );

  const verdictParsed = parseJSON(verdictRaw, {
    knowHow: {
      practical: "E",

      managerial: "II",

      humanRelations: "2",

      reasoning: "Default fallback — LLM did not return valid JSON.",
    },

    problemSolving: {
      environment: "E",

      challenge: "3",

      reasoning: "Default fallback.",
    },

    accountability: {
      freedomToAct: "E",

      magnitude: "3",

      impact: "S",

      reasoning: "Default fallback.",
    },

    recommendedBand: b.band || "JB 8",

    summaryVerdict: verdictRaw.slice(0, 500),
  });

  // Compute actual scores using Guide Charts

  const khPoints = computeKnowHow(
    verdictParsed.knowHow.practical,

    verdictParsed.knowHow.managerial,

    verdictParsed.knowHow.humanRelations,
  );

  const psResult = computeProblemSolving(
    khPoints,

    verdictParsed.problemSolving.environment,

    verdictParsed.problemSolving.challenge,
  );

  const acctPoints = computeAccountability(
    verdictParsed.accountability.freedomToAct,

    verdictParsed.accountability.magnitude,

    verdictParsed.accountability.impact,
  );

  const totalPoints = khPoints + psResult.points + acctPoints;

  const computedBand = mapBand(totalPoints);

  const finalScores = {
    knowHow: { ...verdictParsed.knowHow, points: khPoints },

    problemSolving: {
      ...verdictParsed.problemSolving,

      percentage: psResult.pct,

      points: psResult.points,
    },

    accountability: { ...verdictParsed.accountability, points: acctPoints },

    totalPoints,

    // Band is now ONLY computed from Hay chart — no LLM band

    computedBand,

    recommendedBand: computedBand,

    summaryVerdict:
      verdictParsed.committeeSummary || verdictParsed.summaryVerdict || "",
  };

  await emit(
    "jaeCoe",

    `COMMITTEE CONSENSUS ON HAY FACTORS


Know-How: Practical=${finalScores.knowHow.practical} | Managerial=${finalScores.knowHow.managerial} | Human Relations=${finalScores.knowHow.humanRelations}

Problem Solving: Environment=${finalScores.problemSolving.environment} | Challenge=${finalScores.problemSolving.challenge}

Accountability: Freedom=${finalScores.accountability.freedomToAct} | Magnitude=${finalScores.accountability.magnitude} | Impact=${finalScores.accountability.impact}


────────────────────────────

Hay Guide Chart Computation:

Know-How Points = ${finalScores.knowHow.points}

Problem Solving Points = ${finalScores.problemSolving.points} (${finalScores.problemSolving.percentage}% of Know-How)

Accountability Points = ${finalScores.accountability.points}

TOTAL HAY POINTS = ${totalPoints}


Recommended Band (from Guide Chart): ${computedBand}

────────────────────────────

${finalScores.summaryVerdict}`,
    7,
  );

  return {
    transcript,

    finalVerdict: finalScores,

    agentNames,
  };
}
