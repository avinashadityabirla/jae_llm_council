import "dotenv/config";
import { buildRoleProfile, formatRoleProfile } from "./committee/roleProfile.js";
import { store } from "./store/memoryStore.js";
import { createAgent, agentSpeak } from "./agents/agentRunner.js";
import { buildJAECoESystemPrompt } from "./agents/prompts/jaeCoeAgent.js";

const JD_ID = process.argv[2];

if (!JD_ID) {
  console.log("Usage: node testCommittee.js <jd-id>");
  process.exit(1);
}

console.log("=== TEST 1: Load JD ===");
const jd = await store.findById(JD_ID);
if (!jd) {
  console.log("JD not found");
  process.exit(1);
}
console.log("PASS - JD loaded:", jd.wizardData?.basic?.designation);

console.log("");
console.log("=== TEST 2: Build Role Profile ===");
let profile;
let factSheet;
try {
  profile = buildRoleProfile(jd.wizardData || {});
  factSheet = formatRoleProfile(profile);
  console.log("PASS - Profile built");
  console.log("   Reportees:", profile.totalReportees);
  console.log("   Departments:", profile.reporteeDepts.length);
  console.log("   Magnitude bucket:", profile.suggestedMagnitude);
  console.log("   Financial scale Cr:", profile.financialScaleCr);
  console.log("   Fact sheet length:", factSheet.length, "chars");
} catch (e) {
  console.log("FAIL - Profile build error:", e.message);
  console.log(e.stack);
  process.exit(1);
}

console.log("");
console.log("=== TEST 3: Single Azure Agent Call ===");
try {
  const agent = createAgent("jaeCoe", buildJAECoESystemPrompt("AMC"));
  const start = Date.now();
  const reply = await agentSpeak(
    agent,
    factSheet + "\n\nGive a 2 sentence opening. UNDER 50 WORDS.",
    []
  );
  console.log("PASS - Azure replied in", Date.now() - start, "ms");
  console.log("   Response:", reply.slice(0, 250));
} catch (e) {
  console.log("FAIL - Azure call error:", e.message);
  console.log(e.stack);
  process.exit(1);
}

console.log("");
console.log("ALL TESTS PASSED - committee should work");
process.exit(0);