// backend/committee/orchestrator.js

import { createAgent, agentSpeak, parseJSON } from "../agents/agentRunner.js";
import {
  buildBusinessSystemPrompt,
  getBusinessPersona,
} from "../agents/prompts/businessAgent.js";
import { buildHRSystemPrompt } from "../agents/prompts/hrAgent.js";
import { buildFinanceSystemPrompt } from "../agents/prompts/financeAgent.js";
import { buildJAECoESystemPrompt } from "../agents/prompts/jaeCoeAgent.js";
import { buildRoleProfile, formatRoleProfile } from "./roleProfile.js";
import {
  computeKnowHow,
  computeProblemSolving,
  computeAccountability,
  mapBand,
} from "./hayCharts.js";

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

export async function runCommittee(jd, generated, nuances, onMessage) {
  const wizardData = jd.wizardData || {};
  const b = wizardData.basic || {};
  const lob = b.lob || "AMC";
  const department = b.department || "General";

  // Build the structured fact sheet — this is the key accuracy fix
  let profile;
  let factSheet;
  try {
    profile = buildRoleProfile(wizardData);
    factSheet = formatRoleProfile(profile);
    console.log("STEP D1 - role profile built:", {
      reportees: profile.totalReportees,
      magnitude: profile.suggestedMagnitude,
      scale: profile.financialScaleCr,
    });
  } catch (e) {
    console.error("❌ buildRoleProfile failed:", e.message);
    throw new Error("Role profile build failed: " + e.message);
  }

  const businessPersona = getBusinessPersona(lob, department);
  const agents = {
    business: createAgent("business", buildBusinessSystemPrompt(lob, department)),
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

  // ROUND 1 — JAE COE opens with the fact sheet
  const opening = await agentSpeak(
    agents.jaeCoe,
    `Open this JAE committee.

${factSheet}

NUANCES FROM HR TEAM:
${nuancesSummary}

Give a 3-4 sentence opening that states the role, the key discriminating facts (team size, financial scale, stakeholder seniority), and what the committee must decide. Reference actual numbers from the fact sheet. UNDER 90 WORDS.`,
    []
  );
  await emit("jaeCoe", opening, 1);

  // ROUNDS 2-4 — Agents give FACTOR-LEVEL views in parallel
  const businessView = await agentSpeak(
    agents.business,
    `${factSheet}

As ${businessPersona.role}, give your view on ACCOUNTABILITY factors only.

State explicitly:
- Freedom to Act (A-H) and why
- Magnitude bucket (1-6) and why
- Impact type (R/C/S/P) and why

Cite specific numbers from the fact sheet. 3 sentences MAX. UNDER 90 WORDS. Do NOT mention any Job Band.`,
    transcript
  );
  await emit("business", businessView, 2);

  const hrView = await agentSpeak(
    agents.hr,
    `${factSheet}

As HR Business Partner, give your view on KNOW-HOW factors only.

State explicitly:
- Managerial breadth (T/I/II/III/IV) based on the reportee data
- Human Relations (1/2/3) based on stakeholder seniority
- Practical Knowledge (A-H) based on role complexity

Cite the exact reportee count and departments. Challenge any inflation. 3 sentences MAX. UNDER 90 WORDS. Do NOT mention any Job Band.`,
    transcript
  );
  await emit("hr", hrView, 3);

  const financeView = await agentSpeak(
    agents.finance,
    `${factSheet}

As Finance Business Partner, interrogate the MAGNITUDE and IMPACT.

The computed magnitude bucket is ${profile.suggestedMagnitude} based on Rs ${profile.financialScaleCr} Cr.

State explicitly:
- Do you accept magnitude bucket ${profile.suggestedMagnitude}? If not, what and why?
- Is Impact Prime, Shared, Contributory, or Remote? Justify with ownership evidence.

3 sentences MAX. UNDER 90 WORDS. Do NOT mention any Job Band.`,
    transcript
  );
  await emit("finance", financeView, 4);

  // ROUND 5 — JAE COE surfaces factor disagreements
  const debate = await agentSpeak(
    agents.jaeCoe,
    `${factSheet}

The three agents have given factor views. Identify where they DISAGREE on specific factor letters/numbers. Ask one pointed question to resolve the biggest gap.

3-4 sentences. UNDER 100 WORDS.`,
    transcript
  );
  await emit("jaeCoe", debate, 5);

  // ROUND 6 — Agents respond in parallel
  const businessResponse = await agentSpeak(
    agents.business,
    `Answer the JAE COE's question. State your FINAL factor recommendation for Accountability. 2 sentences MAX. UNDER 60 WORDS.`,
    transcript
  );
  await emit("business", businessResponse, 6);

  const hrResponse = await agentSpeak(
    agents.hr,
    `Answer the JAE COE's question. State your FINAL factor recommendation for Know-How. 2 sentences MAX. UNDER 60 WORDS.`,
    transcript
  );
  await emit("hr", hrResponse, 6);

  const financeResponse = await agentSpeak(
    agents.finance,
    `Answer the JAE COE's question. State your FINAL Magnitude and Impact. 2 sentences MAX. UNDER 60 WORDS.`,
    transcript
  );
  await emit("finance", financeResponse, 6);

  // ROUND 7 — Final verdict WITH fact sheet re-injected
  const verdictRaw = await agentSpeak(
    agents.jaeCoe,
    `${factSheet}

Now produce the final Hay factor recommendation.

MANDATORY CHECKS before you answer:
1. Managerial: reportees = ${profile.totalReportees} across ${profile.reporteeDepts.length} departments. ${profile.hasNoReportees ? "This is an INDIVIDUAL CONTRIBUTOR — Managerial MUST be T." : ""}
2. Magnitude: computed bucket = ${profile.suggestedMagnitude} (Rs ${profile.financialScaleCr} Cr). Do not exceed without evidence.
3. Human Relations: Board contact = ${profile.touchesBoard ? "YES" : "NO"}, CXO contact = ${profile.touchesCxo ? "YES" : "NO"}.
4. Freedom: requires approval = ${profile.requiresApproval ? "YES (cap at E)" : "NO"}, board-facing = ${profile.boardFacing ? "YES" : "NO"}.

Apply the DECISION RULES from your system prompt mechanically. Do NOT default to middle values.

Return ONLY the JSON schema. No markdown fences.`,
    transcript
  );

  const fallback = {
    knowHow: {
      practical: "E",
      managerial: profile.hasNoReportees ? "T" : "I",
      humanRelations: profile.touchesBoard ? "3" : "2",
      reasoning: "Fallback — LLM did not return valid JSON.",
    },
    problemSolving: {
      environment: "E",
      challenge: "3",
      reasoning: "Fallback.",
    },
    accountability: {
      freedomToAct: profile.requiresApproval ? "D" : "E",
      magnitude: String(profile.suggestedMagnitude || 2),
      impact: "S",
      reasoning: "Fallback.",
    },
    matchedAnchor: "unknown",
    committeeSummary: verdictRaw.slice(0, 400),
  };

  const parsed = parseJSON(verdictRaw, fallback);

  // HARD OVERRIDE — enforce non-negotiable rules regardless of LLM output
  if (profile.hasNoReportees) {
    parsed.knowHow.managerial = "T";
  }
  if (profile.suggestedMagnitude === 0 && parsed.accountability) {
    parsed.accountability.magnitude = "1";
  }

  const khPoints = computeKnowHow(
    parsed.knowHow.practical,
    parsed.knowHow.managerial,
    parsed.knowHow.humanRelations
  );
  const psResult = computeProblemSolving(
    khPoints,
    parsed.problemSolving.environment,
    parsed.problemSolving.challenge
  );
  const acctPoints = computeAccountability(
    parsed.accountability.freedomToAct,
    parsed.accountability.magnitude,
    parsed.accountability.impact
  );

  const totalPoints = khPoints + psResult.points + acctPoints;
  const computedBand = mapBand(totalPoints);

  const finalScores = {
    knowHow: { ...parsed.knowHow, points: khPoints },
    problemSolving: {
      ...parsed.problemSolving,
      percentage: psResult.pct,
      points: psResult.points,
    },
    accountability: { ...parsed.accountability, points: acctPoints },
    totalPoints,
    computedBand,
    recommendedBand: computedBand,
    matchedAnchor: parsed.matchedAnchor || "",
    roleSignals: {
      totalReportees: profile.totalReportees,
      departmentsManaged: profile.reporteeDepts.length,
      financialScaleCr: profile.financialScaleCr,
      computedMagnitudeBucket: profile.suggestedMagnitude,
      touchesBoard: profile.touchesBoard,
      touchesCxo: profile.touchesCxo,
    },
    summaryVerdict: parsed.committeeSummary || parsed.summaryVerdict || "",
  };

  await emit(
    "jaeCoe",
    `COMMITTEE CONSENSUS ON HAY FACTORS

Matched anchor: ${finalScores.matchedAnchor || "n/a"}

Know-How: Practical=${finalScores.knowHow.practical} | Managerial=${finalScores.knowHow.managerial} | Human Relations=${finalScores.knowHow.humanRelations}
  ${finalScores.knowHow.reasoning}

Problem Solving: Environment=${finalScores.problemSolving.environment} | Challenge=${finalScores.problemSolving.challenge}
  ${finalScores.problemSolving.reasoning}

Accountability: Freedom=${finalScores.accountability.freedomToAct} | Magnitude=${finalScores.accountability.magnitude} | Impact=${finalScores.accountability.impact}
  ${finalScores.accountability.reasoning}

────────────────────────────
ROLE SIGNALS USED
Reportees: ${profile.totalReportees} across ${profile.reporteeDepts.length} dept(s)
Financial scale: Rs ${profile.financialScaleCr} Cr (bucket ${profile.suggestedMagnitude})
Board contact: ${profile.touchesBoard ? "Yes" : "No"} | CXO contact: ${profile.touchesCxo ? "Yes" : "No"}

HAY GUIDE CHART COMPUTATION
Know-How = ${khPoints}
Problem Solving = ${psResult.points} (${psResult.pct}% of Know-How)
Accountability = ${acctPoints}
TOTAL = ${totalPoints}

RECOMMENDED BAND: ${computedBand}
────────────────────────────

${finalScores.summaryVerdict}`,
    7
  );

  return { transcript, finalVerdict: finalScores, agentNames };
}