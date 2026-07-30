import { useEffect, useState, useCallback } from "react";

import Dashboard from "./components/Dashboard";

import Wizard from "./components/Wizard";

import JDView from "./components/JDView";

import CommitteeLaunch from "./components/CommitteeLaunch";

import CommitteeLive from "./components/CommitteeLive";

import CommitteeVerdict from "./components/CommitteeVerdict";

import CommitteesList from "./components/CommitteesList";

import ReportsList from "./components/ReportsList";

import Layout from "./components/ui/Layout";

import Toast from "./components/ui/Toast";

import { useJDStore } from "./store/useJDStore";

import { healthCheck } from "./api/client";

import SettingsPage from "./components/SettingsPage";

function App() {
  const [view, setView] = useState("dashboard");

  const [apiOk, setApiOk] = useState(null);

  const loadJd = useJDStore((s) => s.loadJd);

  const resetWizard = useJDStore((s) => s.resetWizard);

  const openWizard = useCallback(() => setView("wizard"), []);

  const openDashboard = useCallback(() => setView("dashboard"), []);

  const openLaunch = useCallback(() => setView("launch"), []);

  const openLive = useCallback(() => setView("live"), []);

  const openVerdict = useCallback(() => setView("verdict"), []);

  const openCommittees = useCallback(() => setView("committees"), []);

  const handleOpenJd = useCallback(
    async (id) => {
      await loadJd(id);

      const status = useJDStore.getState().currentJdStatus;

      if (status === "FINALIZED") setView("jdview");
      else setView("wizard");
    },
    [loadJd],
  );

  const handleSidebarNav = useCallback(
    (key) => {
      if (key === "dashboard") setView("dashboard");

      if (key === "wizard") {
        resetWizard();
        setView("wizard");
      }

      if (key === "committees") setView("committees");

      if (key === "reports") setView("reports");

      if (key === "settings") setView("settings");
    },
    [resetWizard],
  );

  useEffect(() => {
    healthCheck()
      .then(() => setApiOk(true))
      .catch(() => setApiOk(false));
  }, []);

  if (apiOk === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  if (apiOk === false) return <BackendDown />;

  const breadcrumbs = {
    dashboard: ["Dashboard"],

    wizard: ["JDs", "JD Wizard"],

    jdview: ["JDs", "View JD"],

    launch: ["JDs", "JD Wizard", "Launch Committee"],

    live: ["Committees", "Live Debate"],

    verdict: ["Committees", "Verdict"],

    committees: ["Committees"],

    reports: ["Reports"],

    settings: ["Settings"],
  };

  const sidebarActive = {
    dashboard: "dashboard",

    wizard: "wizard",

    jdview: "dashboard",

    launch: "wizard",

    live: "committees",

    verdict: "committees",

    committees: "committees",

    reports: "reports",
  };

  return (
    <>
      <Layout
        activeView={sidebarActive[view]}
        onNavigate={handleSidebarNav}
        breadcrumbs={breadcrumbs[view] || []}
      >
        {view === "dashboard" && (
          <Dashboard onCreateNew={openWizard} onOpenJd={handleOpenJd} />
        )}

        {view === "wizard" && (
          <Wizard onBack={openDashboard} onLaunchCommittee={openLaunch} />
        )}

        {view === "jdview" && (
          <JDView onBack={openDashboard} onEdit={() => setView("wizard")} />
        )}

        {view === "launch" && (
          <CommitteeLaunch onBack={openWizard} onLaunched={openLive} />
        )}

        {view === "live" && (
          <CommitteeLive onBack={openDashboard} onFinished={openVerdict} />
        )}

        {view === "verdict" && <CommitteeVerdict onBack={openCommittees} />}

        {view === "committees" && (
          <CommitteesList onOpenVerdict={openVerdict} />
        )}

        {view === "reports" && <ReportsList />}

        {view === "settings" && <SettingsPage />}
      </Layout>

      <Toast />
    </>
  );
}

function BackendDown() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-danger-light">
      <div className="card p-8 max-w-md text-center">
        <div className="text-4xl mb-4">⚠️</div>

        <h1 className="text-xl font-bold text-danger-dark mb-2">
          Backend Not Reachable
        </h1>

        <p className="text-neutral-600 mb-4">
          The backend at <code>http://localhost:4000</code> is not responding.
        </p>

        <p className="text-xs text-neutral-500">
          Run <code>cd backend && npm run dev</code> and refresh.
        </p>
      </div>
    </div>
  );
}

export default App;
