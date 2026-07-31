// backend/committee/roleProfile.js
// Extracts discriminating signals from JD data for accurate Hay scoring

function parseAmount(str) {
  if (!str) return 0;

  let s = String(str).toLowerCase().trim();

  // Remove currency symbols and words
  s = s.replace(/[₹$]/g, "");
  s = s.replace(/\brs\.?\b/g, "");
  s = s.replace(/\binr\b/g, "");

  // Detect unit BEFORE stripping text
  const hasLakhCr = /lakh\s*cr|lac\s*cr|lakh\s*crore|lac\s*crore/.test(s);
  const hasCr = /\bcr\b|\bcrore/.test(s);
  const hasLakh = /\blakh\b|\blac\b/.test(s);
  const hasMn = /\bmn\b|\bmillion\b/.test(s);
  const hasBn = /\bbn\b|\bbillion\b/.test(s);

  // Extract the first numeric value (handles commas)
  const match = s.match(/[\d,]+(\.\d+)?/);
  if (!match) return 0;

  const num = parseFloat(match[0].replace(/,/g, ""));
  if (isNaN(num) || num <= 0) return 0;

  // Convert to crores
  if (hasLakhCr) return num * 100000;
  if (hasCr) return num;
  if (hasBn) return num * 100;
  if (hasMn) return num / 10;
  if (hasLakh) return num / 100;

  // No unit specified — treat plain numbers as crores if reasonable,
  // otherwise assume rupees
  if (num > 10000000) return num / 10000000; // rupees to crores
  return num;
}

function magnitudeBucket(crores) {
  if (crores >= 100000) return 6;
  if (crores >= 25000) return 5;
  if (crores >= 5000) return 4;
  if (crores >= 500) return 3;
  if (crores >= 50) return 2;
  if (crores > 0) return 1;
  return 0;
}

export function buildRoleProfile(wizardData) {
  const b = wizardData?.basic || {};
  const bc = wizardData?.businessContext || {};
  const dims = wizardData?.dimensions || [];
  const reportees = wizardData?.hasNoReportees
    ? []
    : wizardData?.reportees || [];
  const rel = wizardData?.relationships || { internal: [], external: [] };
  const accs = wizardData?.accountabilities || [];

  const totalReportees = reportees.reduce(
    (s, r) => s + (Number(r.count) || 0),
    0
  );
  const reporteeDepts = [
    ...new Set(reportees.map((r) => r.department).filter(Boolean)),
  ];
  const reporteeBands = reportees
    .map((r) => r.band)
    .filter(Boolean)
    .map((x) => parseInt(String(x).replace(/[^0-9]/g, ""), 10))
    .filter((n) => !isNaN(n));
  const seniorMostReportee = reporteeBands.length
    ? Math.min(...reporteeBands)
    : null;

  let maxCr = 0;
  const dimLines = dims.map((d) => {
    const cr = parseAmount(d.fyCurrent);
    if (cr > maxCr) maxCr = cr;
    return `${d.name}: ${d.fyCurrent || "n/a"}`;
  });

  const bcAum = parseAmount(bc.financials?.aum);
  const bcRevenue = parseAmount(bc.financials?.revenue);
  const bcBudget = parseAmount(bc.financials?.budget);

  let financialScale = Math.max(maxCr, bcAum, bcRevenue, bcBudget);

  // Sanity cap — nothing at ABC exceeds 10 lakh crore
  if (financialScale > 1000000) {
    console.warn(
      "Suspicious financial scale detected:",
      financialScale,
      "Cr. Capping at 1,000,000 Cr."
    );
    financialScale = 1000000;
  }

  const suggestedMagnitude = magnitudeBucket(financialScale);

  const allStakeholders = [
    ...(rel.internal || []).map((r) => r.type || ""),
    ...(rel.external || []).map((r) => r.type || ""),
  ]
    .join(" ")
    .toLowerCase();

  const touchesBoard = /board|chairman|group ceo|managing director/.test(
    allStakeholders
  );
  const touchesCxo = /\bceo\b|\bcio\b|\bcfo\b|\bchro\b|\bcoo\b|\bcto\b|\bcdo\b|\bcro\b|\bcco\b|chief /.test(
    allStakeholders
  );
  const touchesRegulator = /sebi|rbi|irdai|amfi|regulator|auditor/.test(
    allStakeholders
  );

  const da = (bc.decisionAuthority || "").toLowerCase();
  const hasIndependentAuthority =
    /independent authority|independently|sole discretion|own decision/.test(da);
  const requiresApproval = /requires approval|subject to approval|escalat/.test(
    da
  );
  const boardFacing = /board|committee|advisory to board/.test(da);

  const accCount = accs.length;
  const actionCount = accs.reduce(
    (s, a) => s + ((a.actions || []).length || 0),
    0
  );

  const targetBandNum = parseInt(
    String(b.band || "").replace(/[^0-9]/g, ""),
    10
  );

  return {
    designation: b.designation || "Not specified",
    positionTitle: b.positionTitle || "",
    lob: b.lob || "",
    department: b.department || "",
    function: b.function || "",
    targetBand: b.band || "Not specified",
    targetBandNum: isNaN(targetBandNum) ? null : targetBandNum,
    reportsTo: b.reportsToTitle || b.managerDesignation || "Not specified",

    hasNoReportees: !!wizardData?.hasNoReportees,
    totalReportees,
    reporteeGroupCount: reportees.length,
    reporteeDepts,
    seniorMostReporteeBand: seniorMostReportee,
    reporteeDetail:
      reportees
        .map(
          (r) =>
            `${r.count} people at ${r.band || "unknown band"} in ${r.department || "unknown dept"}`
        )
        .join("; ") || "None",

    financialScaleCr: Math.round(financialScale),
    suggestedMagnitude,
    dimensionLines: dimLines.join(" | ") || "None provided",
    budget: bc.financials?.budget || "N/A",
    revenue: bc.financials?.revenue || "N/A",
    aum: bc.financials?.aum || "N/A",

    touchesBoard,
    touchesCxo,
    touchesRegulator,
    internalStakeholders:
      (rel.internal || []).map((r) => r.type).filter(Boolean).join(", ") ||
      "None listed",
    externalStakeholders:
      (rel.external || []).map((r) => r.type).filter(Boolean).join(", ") ||
      "None listed",

    decisionAuthority: bc.decisionAuthority || "Not specified",
    hasIndependentAuthority,
    requiresApproval,
    boardFacing,

    accountabilityCount: accCount,
    actionCount,
    rolePurpose: bc.rolePurpose || wizardData?.jobPurpose || "Not specified",
    outcomes: (bc.outcomes || []).join(", ") || "Not specified",
  };
}

export function formatRoleProfile(p) {
  return `
ROLE FACT SHEET

IDENTITY
Designation: ${p.designation}
LOB / Dept / Function: ${p.lob} / ${p.department} / ${p.function}
Reports to: ${p.reportsTo}
HR target band: ${p.targetBand}

TEAM SCOPE (drives Managerial Know-How)
Individual Contributor: ${p.hasNoReportees ? "YES" : "NO"}
Total reportees: ${p.totalReportees}
Departments managed: ${p.reporteeDepts.length}
Most senior reportee: ${p.seniorMostReporteeBand ? "JB " + p.seniorMostReporteeBand : "n/a"}
Detail: ${p.reporteeDetail}

FINANCIAL SCALE (drives Magnitude)
Largest quantified value: Rs ${p.financialScaleCr} Cr
COMPUTED MAGNITUDE BUCKET: ${p.suggestedMagnitude}
Dimensions: ${p.dimensionLines}

STAKEHOLDERS (drives Human Relations and Impact)
Board contact: ${p.touchesBoard ? "YES" : "NO"}
CXO contact: ${p.touchesCxo ? "YES" : "NO"}
Regulator contact: ${p.touchesRegulator ? "YES" : "NO"}
Internal: ${p.internalStakeholders}
External: ${p.externalStakeholders}

DECISION AUTHORITY (drives Freedom to Act)
Independent authority: ${p.hasIndependentAuthority ? "YES" : "NO"}
Requires approval: ${p.requiresApproval ? "YES" : "NO"}
Board-facing: ${p.boardFacing ? "YES" : "NO"}

SCOPE
Accountabilities: ${p.accountabilityCount}
Purpose: ${p.rolePurpose}
`;
}