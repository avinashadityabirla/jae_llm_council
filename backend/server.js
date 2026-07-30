import express from "express";

import cors from "cors";

import jdRoutes from "./routes/jd.js";

import committeeRoutes from "./routes/committee.js";

import systemRoutes from "./routes/health.js";

const app = express();

app.use(cors());

app.use("/api/system", systemRoutes);

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  next();
});

// Health Check

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",

    timestamp: new Date().toISOString(),
  });
});

// Routes

app.use("/api/jd", jdRoutes);

app.use("/api/committee", committeeRoutes);

// 404

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Error Handler

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:");

  console.error(err);

  res.status(500).json({
    error: err.message,
  });
});

// Ollama Warmup

setTimeout(async () => {
  try {
    const response = await fetch(
      "http://localhost:11434/api/generate",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "qwen2.5:1.5b",

          prompt: "hello",

          stream: false,

          options: {
            num_predict: 5,
          },
        }),
      },
    );

    if (response.ok) {
      console.log("🔥 Ollama warmed up");
    } else {
      console.log("⚠️ Ollama warmup failed");
    }
  } catch (err) {
    console.log("⚠️ Ollama not running");
  }
}, 2000);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
