import express from "express";
import cors from "cors";

import jdRoutes from "./routes/jd.js";
import committeeRoutes from "./routes/committee.js";
import systemRoutes from "./routes/health.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/jd", jdRoutes);
app.use("/api/committee", committeeRoutes);
app.use("/api/system", systemRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:");
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Azure OpenAI warmup
setTimeout(async () => {
  try {
    const { azureHealthCheck } = await import("./ai/azureClient.js");
    const result = await azureHealthCheck();
    if (result.status === "ok") {
      console.log("🔥 Azure OpenAI ready:", result.model);
    } else {
      console.log("⚠️ Azure OpenAI not reachable:", result.error);
    }
  } catch (err) {
    console.log("⚠️ Azure OpenAI warmup skipped:", err.message);
  }
}, 2000);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});