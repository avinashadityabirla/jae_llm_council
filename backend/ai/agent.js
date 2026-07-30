// backend/ai/agent.js — Calls Ollama for all 6 JD sections per ABSLAMC template

import { HAY_SYSTEM_PROMPT } from "./hayKnowledge.js";

const OLLAMA_URL = "http://localhost:11434/api/generate";

const MODEL = "qwen2.5:1.5b";

async function callLLM(userPrompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({
      model: MODEL,

      system: HAY_SYSTEM_PROMPT,

      prompt: userPrompt,

      stream: false,

      options: { temperature: 0.3 },
    }),
  });

  if (!response.ok) {
    throw new Error("Ollama request failed with status " + response.status);
  }

  const data = await response.json();

  return (data.response || "").trim();
}

function buildContext(wizardData) {
  const b = wizardData.basic || {};

  const bc = wizardData.businessContext || {};

  const bcSummary = bc.rolePurpose
    ? `

BUSINESS CONTEXT (provided by HR):

- Why this role exists: ${bc.rolePurpose}

- Outcomes: ${(bc.outcomes || []).join(", ") || "Not specified"}

- Decision authority: ${bc.decisionAuthority || "Not specified"}

- Financial responsibility: Budget=${bc.financials?.budget || "N/A"}, Revenue=${bc.financials?.revenue || "N/A"}, AUM=${bc.financials?.aum || "N/A"}, Cost=${bc.financials?.cost || "N/A"}

`
    : "";

  return {
    lob: b.lob || "AMC",

    business: b.business || "",

    department: b.department || "",

    function: b.function || "",

    band: b.band || "",

    designation: b.designation || "",

    positionTitle: b.positionTitle || "",

    bcSummary,
  };
}

function dimensionsSummary(dims) {
  if (!Array.isArray(dims) || dims.length === 0) return "None";

  return dims

    .map((d) => (d.name || "") + " = " + (d.fyCurrent || ""))

    .filter((s) => s !== " = ")

    .join("; ");
}

export async function generateJD(wizardData) {
  const ctx = buildContext(wizardData);

  const dimsText = dimensionsSummary(wizardData.dimensions);

  const rawAcc = JSON.stringify(wizardData.accountabilities || []);

  const rawRel = JSON.stringify(wizardData.relationships || {});

  const rawDR = JSON.stringify(wizardData.directReports || []);

  const p_jobPurpose =
    "Write a formal Hay-style Job Purpose paragraph (3-5 sentences) for this role.\n" +
    "LOB: " +
    ctx.lob +
    " | Business: " +
    ctx.business +
    " | Function: " +
    ctx.function +
    "\n" +
    "Department: " +
    ctx.department +
    " | Designation: " +
    ctx.designation +
    " | Band: " +
    ctx.band +
    "\n" +
    ctx.bcSummary +
    "Raw input from HR: " +
    (wizardData.jobPurpose || "Not provided") +
    "\n" +
    "Dimensions: " +
    dimsText +
    "\n\n" +
    "Match band-appropriate verbs (JB 1 highest, JB 8 lowest — this role is " +
    ctx.band +
    ").\n" +
    "Quantify from dimensions. Third person present tense.\n" +
    "Return ONLY the paragraph.";

  const p_orgContext =
    "Write the Organisation Context paragraph for " +
    (ctx.business || "the business") +
    ".\n" +
    "This should cover: entity name and lineage, AUM/scale, market rank, distribution footprint, employee strength, product breadth, and 2-3 competitive strengths.\n" +
    "Raw HR input: " +
    (wizardData.orgContext || "Not provided") +
    "\n" +
    "Reference dimensions where available: " +
    dimsText +
    "\n\n" +
    "Return ONLY the paragraph. 200-300 words.";

  const p_jobContext =
    "Write 5-8 bullet points describing the Job Context for this " +
    ctx.band +
    " " +
    ctx.designation +
    " role in " +
    ctx.department +
    ".\n" +
    "Each bullet should describe a scope/oversight area — what the role leads, oversees, or drives.\n" +
    "Raw HR input: " +
    (wizardData.jobContext || "Not provided") +
    "\n\n" +
    "Return as a numbered list. Each bullet in third person present tense. Start with band-appropriate verbs.";

  const p_challenges =
    "Convert this into 8-12 formal Hay-grade Key Challenge statements.\n" +
    "Context: " +
    ctx.lob +
    " | " +
    ctx.department +
    " | " +
    ctx.band +
    " | " +
    ctx.designation +
    "\n" +
    "Raw challenges from HR: " +
    JSON.stringify(wizardData.challenges || []) +
    "\n\n" +
    "Each challenge MUST:\n" +
    "- Start with a complexity signal (Navigating, Balancing, Interpreting, Managing competing priorities, Ensuring, To deploy, To ensure)\n" +
    "- Reference specific regulator/market reality (SEBI, AMFI, RBI, competition, distributors)\n" +
    "- Quantify or qualify where possible\n\n" +
    "Return as a numbered list, one challenge per line.";

  const p_accountabilities =
    "Transform these raw accountabilities into a structured list matching ABSLAMC template.\n" +
    "Context: " +
    ctx.lob +
    " | " +
    ctx.department +
    " | " +
    ctx.band +
    "\n" +
    "Raw input: " +
    rawAcc +
    "\n\n" +
    "For each accountability, produce:\n" +
    "  - A short bold accountability heading (2-6 words)\n" +
    "  - 3-6 supporting action bullets (each starts with band-appropriate verb)\n\n" +
    "Return as JSON array with this exact schema:\n" +
    '[{"accountability":"Heading","actions":["Action 1","Action 2"]}, ...]\n' +
    "Return ONLY the JSON array. No preamble.";

  const hasNoReportees = wizardData.hasNoReportees || false;

  const effectiveReportees = hasNoReportees ? [] : wizardData.reportees || [];

  const reporteeSummary = hasNoReportees
    ? "This is an Individual Contributor role with NO direct reportees."
    : effectiveReportees.length === 0
      ? "No reportees specified."
      : effectiveReportees
          .map(
            (r) =>
              `- ${r.count} × ${r.band || "unspecified band"} in ${r.department || "unspecified dept"}`,
          )
          .join("\n");

  const p_directReports = hasNoReportees
    ? null
    : "Write formal Job Purpose descriptions for these direct reports of a " +
      ctx.band +
      " " +
      ctx.designation +
      ".\n" +
      "Reportee groups:\n" +
      reporteeSummary +
      "\n\n" +
      "For each reportee group, produce a 1-2 sentence description of their primary responsibility.\n" +
      "Return as JSON array:\n" +
      '[{"role":"Role Name","purpose":"Their primary responsibility..."}, ...]\n' +
      "Return ONLY the JSON.";

  // Run all 6 in parallel for speed

  const promises = [
    callLLM(p_jobPurpose),

    callLLM(p_orgContext),

    callLLM(p_jobContext),

    callLLM(p_challenges),

    callLLM(p_accountabilities),
  ];

  if (p_directReports) promises.push(callLLM(p_directReports));

  const results = await Promise.all(promises);

  const [jobPurpose, orgContext, jobContext, challenges, accountabilitiesRaw] =
    results;

  const directReportsRaw = p_directReports ? results[5] : "[]";

  const accountabilities = safeJSON(accountabilitiesRaw, []);

  const directReports = safeJSON(directReportsRaw, []);

  return {
    jobPurpose,

    orgContext,

    jobContext,

    challenges,

    accountabilities,

    directReports: hasNoReportees ? [] : directReports,

    hasNoReportees,

    managerAbove: wizardData.managerAbove || {},

    reportees: effectiveReportees,

    basic: wizardData.basic || {},

    dimensions: wizardData.dimensions || [],

    relationships: wizardData.relationships || { internal: [], external: [] },

    signOff: wizardData.signOff || {},

    generatedAt: new Date().toISOString(),

    model: MODEL,
  };
}

function safeJSON(text, fallback) {
  try {
    const match =
      text.match(/```json([\s\S]*?)```/) ||
      text.match(/```([\s\S]*?)```/) ||
      text.match(/(\[[\s\S]*\])/);

    const raw = match ? match[1] || match[0] : text;

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
