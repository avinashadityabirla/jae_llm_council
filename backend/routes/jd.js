import express from "express";

import { store } from "../store/memoryStore.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const allJds = await store.findAll();

    res.json({
      count: allJds.length,

      jds: allJds.map((jd) => ({
        id: jd.id,

        lob: jd.wizardData?.basic?.lob || "Unknown",

        designation: jd.wizardData?.basic?.designation || "Untitled",

        status: jd.status,

        createdAt: jd.createdAt,

        updatedAt: jd.updatedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const jd = await store.findById(req.params.id);

    if (!jd)
      return res.status(404).json({ error: "JD not found", id: req.params.id });

    res.json(jd);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newJd = await store.create({
      status: "DRAFT",

      wizardData: req.body.wizardData || {},
    });

    res.status(201).json(newJd);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updated = await store.update(req.params.id, req.body);

    if (!updated)
      return res.status(404).json({ error: "JD not found", id: req.params.id });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/generate", async (req, res, next) => {
  try {
    const jd = await store.findById(req.params.id);

    if (!jd)
      return res.status(404).json({ error: "JD not found", id: req.params.id });

    const { generateJD } = await import("../ai/agent.js");

    const generated = await generateJD(jd.wizardData || {});

    const updated = await store.updateGenerated(req.params.id, generated);

    res.json({ generated, jd: updated });
  } catch (err) {
    console.error("Generate error:", err);

    next(err);
  }
});

router.post("/:id/finalize", async (req, res, next) => {
  try {
    const updated = await store.setStatus(req.params.id, "FINALIZED");

    if (!updated)
      return res.status(404).json({ error: "JD not found", id: req.params.id });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/reopen", async (req, res, next) => {
  try {
    const updated = await store.setStatus(req.params.id, "DRAFT");

    if (!updated)
      return res.status(404).json({ error: "JD not found", id: req.params.id });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/download", async (req, res, next) => {
  try {
    const jd = await store.findById(req.params.id);

    if (!jd)
      return res.status(404).json({ error: "JD not found", id: req.params.id });

    const { buildJDDocx } = await import("../exporters/wordExporter.js");

    const buffer = await buildJDDocx(jd, jd.generatedJd || {});

    const desig = (jd.wizardData?.basic?.designation || "JD").replace(
      /[^a-zA-Z0-9]/g,
      "_",
    );

    const lob = jd.wizardData?.basic?.lob || "ABC";

    const filename = lob + "_" + desig + "_JD.docx";

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + filename + '"',
    );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    res.send(buffer);
  } catch (err) {
    console.error("Download error:", err);

    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const ok = await store.delete(req.params.id);

    if (!ok)
      return res.status(404).json({ error: "JD not found", id: req.params.id });

    res.json({ message: "JD deleted successfully", id: req.params.id });
  } catch (err) {
    next(err);
  }
});

export default router;
