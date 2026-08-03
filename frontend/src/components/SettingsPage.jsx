import { useEffect, useState, useCallback } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { API_BASE } from "../api/client";

function SettingsPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const runHealthCheck = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE + "/system/health");
      const data = await res.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (err) {
      setHealth({
        backend: { status: "down", label: "Not reachable" },
        database: { status: "down", label: "Unknown" },
        ai: { status: "down", label: "Unknown", provider: "Azure OpenAI" },
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">
            AI configuration and system health
          </p>
        </div>
        <Button variant="primary" onClick={runHealthCheck} icon="🔄">
          {loading ? "Checking..." : "Run Health Check"}
        </Button>
      </div>

      <Card title="AI Configuration" className="mb-6">
        <div className="space-y-4">
          <Row label="Provider" value="Azure OpenAI" />
          <Row label="Deployment" value={health?.ai?.model || "-"} />
          <Row label="Endpoint" value={health?.ai?.endpoint || "-"} />
          <Row
            label="Status"
            value={
              <StatusDot
                ok={health?.ai?.status === "ok"}
                okText="Connected"
                downText="Not reachable"
              />
            }
          />
        </div>

        {health?.ai?.status === "down" && (
          <div className="mt-4 p-3 bg-warning-light text-warning-dark rounded-lg text-sm">
            Azure OpenAI not reachable. Check AZURE_OPENAI_ENDPOINT,
            AZURE_OPENAI_DEPLOYMENT and AZURE_OPENAI_API_KEY in the backend .env
            file.
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
                ? String(health.database.jdCount) + " JDs stored"
                : "Connection failed"
            }
            ok={health?.database?.status === "ok"}
          />
          <HealthRow
            icon="🤖"
            name="Azure OpenAI"
            detail={health?.ai?.model || "Not configured"}
            ok={health?.ai?.status === "ok"}
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
          <Row label="Version" value="2.0.0" />
        </div>
      </Card>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 gap-4">
      <span className="text-sm text-neutral-500 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-neutral-900 text-right break-all">
        {value}
      </span>
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
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <div className="text-sm font-medium text-neutral-900">{name}</div>
          <div className="text-xs text-neutral-500 truncate">{detail}</div>
        </div>
      </div>
      <span
        className={
          "flex items-center gap-2 text-sm font-medium flex-shrink-0 " +
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