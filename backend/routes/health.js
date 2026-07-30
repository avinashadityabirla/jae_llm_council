import express from "express";

import { pool } from "../db/pool.js";

const router = express.Router();

// GET /api/system/health — checks DB + Ollama + returns model info

router.get("/health", async (req, res) => {
  const result = {
    backend: { status: "ok", label: "Connected" },

    database: { status: "down", label: "Not connected", jdCount: 0 },

    ollama: { status: "down", label: "Not running", model: "qwen2.5:1.5b" },

    timestamp: new Date().toISOString(),
  };

  // Check database

  try {
    const { rows } = await pool.query("SELECT COUNT(*) AS count FROM jds");

    result.database = {
      status: "ok",

      label: "Connected",

      jdCount: parseInt(rows[0].count, 10) || 0,
    };
  } catch (err) {
    result.database = {
      status: "down",
      label: "Not connected",
      jdCount: 0,
      error: err.message,
    };
  }

  // Check Ollama

  try {
    const r = await fetch("http://localhost:11434/api/tags");

    if (r.ok) {
      const data = await r.json();

      const models = (data.models || []).map((m) => m.name);

      result.ollama = {
        status: "ok",

        label: "Running",

        model: "qwen2.5:1.5b",

        availableModels: models,
      };
    }
  } catch (err) {
    result.ollama = {
      status: "down",
      label: "Not running",
      model: "qwen2.5:1.5b",
      error: err.message,
    };
  }

  res.json(result);
});

export default router;
