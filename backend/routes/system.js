import express from "express";

import { store } from "../store/memoryStore.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  const result = {
    backend: { status: "ok", label: "Connected" },

    database: { status: "down", label: "Not connected", jdCount: 0 },

    ollama: { status: "down", label: "Not running", model: "qwen2.5:1.5b" },

    timestamp: new Date().toISOString(),
  };

  // Check database via store

  try {
    const jds = await store.findAll();

    result.database = { status: "ok", label: "Connected", jdCount: jds.length };
  } catch (err) {
    result.database.error = err.message;
  }

  // Check Ollama

  try {
    const r = await fetch("http://localhost:11434/api/tags");

    if (r.ok) {
      const data = await r.json();

      result.ollama = {
        status: "ok",

        label: "Running",

        model: "qwen2.5:1.5b",

        availableModels: (data.models || []).map((m) => m.name),
      };
    }
  } catch (err) {
    result.ollama.error = err.message;
  }

  res.json(result);
});

export default router;
