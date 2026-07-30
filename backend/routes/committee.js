// backend/routes/committee.js

import express from "express";

import { store as jdStore } from "../store/memoryStore.js";

import { committeeStore } from "../store/committeeStore.js";

import { getBusinessPersona } from "../agents/prompts/businessAgent.js";

const router = express.Router();

router.get("/test", (req, res) => {
  console.log("✅ committee /test route working");

  res.json({ ok: true });
});

// GET /api/committee — List all committees

router.get("/", async (req, res) => {
  try {
    const committees = await committeeStore.findAll();

    res.json({
      count: committees.length,

      committees,
    });
  } catch (err) {
    console.error("List committees error:", err);

    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  console.log("STEP 1 - committee POST route hit");

  try {
    const { jdId, nuances } = req.body;

    console.log("STEP 2 - jdId =", jdId);

    if (!jdId) return res.status(400).json({ error: "jdId is required" });

    const jd = await jdStore.findById(jdId);

    console.log("STEP 3 - jd loaded =", !!jd);

    if (!jd) return res.status(404).json({ error: "JD not found", jdId });

    console.log("STEP 4 - building agent list");

    const basic = jd.wizardData?.basic || {};

    const businessPersona = getBusinessPersona(basic.lob, basic.department);

    const agents = {
      business: { key: "business", name: businessPersona.role },

      hr: { key: "hr", name: "HR Business Partner" },

      finance: { key: "finance", name: "Finance Business Partner" },

      jaeCoe: { key: "jaeCoe", name: "JAE COE Facilitator" },
    };

    console.log("STEP 5 - creating committee in DB");

    const committee = await committeeStore.create(jdId, nuances, agents);

    console.log("STEP 6 - committee created", committee.id);

    runCommitteeAsync(committee.id, jd, nuances).catch((err) => {
      console.error("❌ Committee orchestration failed:", err);

      committeeStore.updateStatus(committee.id, "FAILED").catch(() => {});
    });

    return res.status(201).json({ committeeId: committee.id, agents });
  } catch (err) {
    console.error("❌ POST /api/committee CRASHED:", err);

    return res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const committee = await committeeStore.findById(req.params.id);

    if (!committee)
      return res.status(404).json({ error: "Committee not found" });

    return res.json(committee);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/:id/report.pdf", async (req, res) => {
  try {
    const committee = await committeeStore.findById(req.params.id);

    if (!committee)
      return res.status(404).json({ error: "Committee not found" });

    const jd = await jdStore.findById(committee.jdId);

    if (!jd) return res.status(404).json({ error: "JD not found" });

    const mod = await import("../committee/pdfReport.js");

    const buildCommitteePDF = mod.buildCommitteePDF;

    const b = jd.wizardData?.basic || {};

    const filename =
      (b.lob || "ABC") +
      "_" +
      (b.designation || "JD").replace(/[^a-z0-9]/gi, "_") +
      "_JAE_Verdict.pdf";

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + filename + '"',
    );

    buildCommitteePDF(jd, committee, res);
  } catch (err) {
    console.error("PDF error:", err);

    return res.status(500).json({ error: err.message });
  }
});

async function runCommitteeAsync(committeeId, jd, nuances) {
  console.log("🏁 Starting committee execution:", committeeId);

  try {
    const mod = await import("../committee/orchestrator.js");

    const runCommittee = mod.runCommittee;

    await committeeStore.updateStatus(committeeId, "RUNNING");

    console.log("STEP 7 - status set to RUNNING");

    const onMessage = async (msg) => {
      console.log("🗨️ Message from:", msg.agentName, "Round:", msg.round);

      await committeeStore.appendMessage(committeeId, msg);
    };

    const result = await runCommittee(jd, jd.generatedJd, nuances, onMessage);

    await committeeStore.setVerdict(committeeId, result.finalVerdict);

    console.log("✅ Committee completed:", committeeId);
  } catch (err) {
    console.error("❌ runCommitteeAsync crashed:", err);

    throw err;
  }
}

export default router;
