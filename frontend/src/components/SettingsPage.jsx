import { useEffect, useState, useCallback } from "react";

import Card from "./ui/Card";

import PageHeader from "./ui/PageHeader";

import Button from "./ui/Button";

function SettingsPage() {
  const [health, setHealth] = useState(null);

  const [loading, setLoading] = useState(false);

  const [lastChecked, setLastChecked] = useState(null);

  const runHealthCheck = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/system/health");

      const data = await res.json();

      setHealth(data);

      setLastChecked(new Date());
    } catch {
      setHealth({
        backend: { status: "down", label: "Not reachable" },

        database: { status: "down", label: "Unknown" },

        ollama: { status: "down", label: "Unknown" },
      });

      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Button variant="primary" onClick={runHealthCheck} icon="🔄">
        {loading ? "Checking..." : "Run Health Check"}
      </Button>

      <Card title="AI Configuration" className="mb-6">
        <div className="space-y-4">
          <Row label="LLM Provider" value="Ollama (Local)" />

          <Row
            label="Active Model"
            value={health?.ollama?.model || "qwen2.5:1.5b"}
          />

          <Row
            label="Ollama Status"
            value={
              <StatusDot
                ok={health?.ollama?.status === "ok"}
                okText="Running"
                downText="Not running"
              />
            }
          />

          {health?.ollama?.availableModels?.length > 0 && (
            <div>
              <div className="text-sm text-neutral-500 mb-2">
                Installed Models
              </div>

              <div className="flex flex-wrap gap-2">
                {health.ollama.availableModels.map((m) => (
                  <span key={m} className="badge bg-info-light text-info-dark">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {health?.ollama?.status === "down" && (
          <div className="mt-4 p-3 bg-warning-light text-warning-dark rounded-lg text-sm">
            ⚠️ Ollama is not running. Start it with{" "}
            <code>brew services start ollama</code> then run a health check.
          </div>
        )}
      </Card>

      <Card title="System Health" className="mb-6">
        <div className="space-y-3">
          <HealthRow
            icon="🖥️"
            name="Backend API"
            detail="http://localhost:4000"
            ok={health?.backend?.status === "ok"}
          />

          <HealthRow
            icon="🗄️"
            name="PostgreSQL Database"
            detail={
              health?.database?.status === "ok"
                ? `${health.database.jdCount} JDs stored`
                : "Connection failed"
            }
            ok={health?.database?.status === "ok"}
          />

          <HealthRow
            icon="🤖"
            name="Ollama LLM"
            detail={
              health?.ollama?.status === "ok"
                ? health.ollama.model
                : "Not responding"
            }
            ok={health?.ollama?.status === "ok"}
          />
        </div>

        {lastChecked && (
          <div className="mt-4 text-xs text-neutral-400 text-right">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </Card>

      <Card title="About">
        <div className="space-y-3">
          <Row label="Application" value="JAE JD Creator" />

          <Row label="Organization" value="Aditya Birla Capital" />

          <Row label="Deployment" value="Local (Development)" />

          <Row label="Version" value="1.0.0" />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-neutral-500">{label}</span>

      <span className="text-sm font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function StatusDot({ ok, okText, downText }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={
          "w-2.5 h-2.5 rounded-full " + (ok ? "bg-success" : "bg-danger")
        }
      />

      <span className={ok ? "text-success-dark" : "text-danger-dark"}>
        {ok ? okText : downText}
      </span>
    </span>
  );
}

function HealthRow({ icon, name, detail, ok }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>

        <div>
          <div className="text-sm font-medium text-neutral-900">{name}</div>

          <div className="text-xs text-neutral-500">{detail}</div>
        </div>
      </div>

      <span
        className={
          "flex items-center gap-2 text-sm font-medium " +
          (ok ? "text-success-dark" : "text-danger-dark")
        }
      >
        <span
          className={
            "w-2.5 h-2.5 rounded-full " + (ok ? "bg-success" : "bg-danger")
          }
        />

        {ok ? "Connected" : "Down"}
      </span>
    </div>
  );
}

export default SettingsPage;
