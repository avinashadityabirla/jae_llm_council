import { create } from "zustand";

import { jdApi } from "../api/client";

const emptyBusinessContext = () => ({
  rolePurpose: "",

  outcomes: [],

  decisionAuthority: "",

  financials: { budget: "", revenue: "", aum: "", cost: "" },

  autoFilledFor: "",
});

const emptyWizardData = () => ({
  basic: {
    lob: "",
    business: "",
    unit: "",
    location: "",

    positionNumber: "",
    positionTitle: "",

    reportsToNumber: "",
    reportsToTitle: "",

    reportsToFunction: "",
    reportsToDepartment: "",

    function: "",
    department: "",
    designation: "",

    managerDesignation: "",
    band: "",

    date: new Date().toISOString().slice(0, 10),
  },

  jobPurpose: "",

  dimensions: [],

  businessContext: emptyBusinessContext(),

  orgContext: "",

  jobContext: "",

  challenges: [],

  accountabilities: [],

  directReports: [],

  managerAbove: { name: "", band: "", department: "" },

  reportees: [],

  hasNoReportees: false,

  relationships: { internal: [], external: [] },

  orgRelationships: "",

  signOff: {
    signature: "",
    name: "",
    date: "",
    analystSignature: "",
    analystName: "",
  },
});

let toastIdCounter = 0;

export const useJDStore = create((set, get) => ({
  jdsList: [],

  currentJdId: null,

  currentJdStatus: "DRAFT",

  currentStep: 1,

  saving: false,

  generating: false,

  message: "",

  wizardData: emptyWizardData(),

  generatedJd: null,

  committeeId: null,

  committee: null,

  committeeLoading: false,

  pollTimer: null,

  committeesList: [],

  committeesLoading: false,

  toasts: [],

  showToast: (message, type = "info", duration = 3000) => {
    const id = ++toastIdCounter;

    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    return id;
  },

  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  setStep: (n) => set({ currentStep: n }),

  setMessage: (m) => set({ message: m }),

  updateSection: (section, value) =>
    set((state) => {
      const nw = { ...state.wizardData };

      nw[section] = value;

      return { wizardData: nw };
    }),

  resetWizard: () =>
    set({
      currentJdId: null,

      currentJdStatus: "DRAFT",

      currentStep: 1,

      wizardData: emptyWizardData(),

      generatedJd: null,

      committeeId: null,

      committee: null,

      message: "",
    }),

  loadJDsList: async () => {
    try {
      const data = await jdApi.list();

      set({ jdsList: data.jds || [] });
    } catch (err) {
      console.error(err);
    }
  },

  loadJd: async (id) => {
    try {
      const jd = await jdApi.get(id);

      const wd = jd.wizardData || {};

      const merged = {
        ...emptyWizardData(),

        ...wd,

        basic: { ...emptyWizardData().basic, ...(wd.basic || {}) },

        businessContext: {
          ...emptyBusinessContext(),

          ...(wd.businessContext || {}),

          financials: {
            ...emptyBusinessContext().financials,
            ...(wd.businessContext?.financials || {}),
          },
        },

        managerAbove: {
          ...emptyWizardData().managerAbove,
          ...(wd.managerAbove || {}),
        },

        reportees: wd.reportees || [],

        hasNoReportees: wd.hasNoReportees || false,

        relationships: {
          internal: wd.relationships?.internal || [],

          external: wd.relationships?.external || [],
        },

        signOff: { ...emptyWizardData().signOff, ...(wd.signOff || {}) },
      };

      set({
        currentJdId: jd.id,

        currentJdStatus: jd.status || "DRAFT",

        currentStep: 1,

        wizardData: merged,

        generatedJd: jd.generatedJd || null,

        committeeId: null,

        committee: null,

        message: "",
      });
    } catch (err) {
      console.error(err);
    }
  },

  saveWizard: async () => {
    const { currentJdId, wizardData } = get();

    set({ saving: true, message: "" });

    try {
      let jd;

      if (currentJdId) {
        jd = await jdApi.update(currentJdId, wizardData);
      } else {
        jd = await jdApi.create(wizardData);

        set({ currentJdId: jd.id });
      }

      set({ message: "Saved successfully", saving: false });

      get().showToast("JD saved successfully", "success");

      return true;
    } catch (err) {
      console.error(err);

      set({ message: "Error saving", saving: false });

      get().showToast("Error saving JD", "error");

      return false;
    }
  },

  generateJD: async () => {
    const { currentJdId } = get();

    if (!currentJdId) {
      get().showToast("Please save the JD first", "warning");
      return false;
    }

    set({ generating: true, message: "AI is generating your JD..." });

    get().showToast("AI is generating your JD...", "info");

    try {
      const result = await jdApi.generate(currentJdId);

      set({
        generatedJd: result.generated,
        generating: false,
        message: "AI generation complete",
      });

      get().showToast("AI generation complete", "success");

      return true;
    } catch (err) {
      console.error(err);

      set({ generating: false, message: "Generation failed" });

      get().showToast("Generation failed. Is Ollama running?", "error");

      return false;
    }
  },

  downloadJD: () => {
    const { currentJdId } = get();

    if (!currentJdId) {
      get().showToast("Save the JD first", "warning");
      return;
    }

    window.open(
      "http://localhost:4000/api/jd/" + currentJdId + "/download",
      "_blank",
    );

    get().showToast("Word download started", "info");
  },

  finalizeJd: async () => {
    const { currentJdId } = get();

    if (!currentJdId) {
      get().showToast("Save the JD first", "warning");
      return false;
    }

    try {
      await jdApi.finalize(currentJdId);

      set({ currentJdStatus: "FINALIZED" });

      get().showToast("JD finalized and locked", "success");

      await get().loadJDsList();

      return true;
    } catch (err) {
      console.error(err);

      get().showToast("Finalize failed", "error");

      return false;
    }
  },

  reopenJd: async () => {
    const { currentJdId } = get();

    if (!currentJdId) return false;

    try {
      await jdApi.reopen(currentJdId);

      set({ currentJdStatus: "DRAFT" });

      get().showToast("JD re-opened for editing", "info");

      await get().loadJDsList();

      return true;
    } catch (err) {
      console.error(err);

      get().showToast("Re-open failed", "error");

      return false;
    }
  },

  deleteJd: async (id) => {
    try {
      await jdApi.remove(id);

      await get().loadJDsList();

      get().showToast("JD deleted", "success");
    } catch (err) {
      console.error(err);

      get().showToast("Delete failed", "error");
    }
  },

  launchCommittee: async (nuances) => {
    const { currentJdId } = get();

    if (!currentJdId) {
      get().showToast("Please save the JD first", "warning");
      return null;
    }

    set({ committeeLoading: true });

    try {
      const res = await fetch("http://localhost:4000/api/committee", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ jdId: currentJdId, nuances }),
      });

      if (!res.ok) {
        const errText = await res.text();

        set({ committeeLoading: false });

        get().showToast("Failed to launch: " + errText, "error");

        return null;
      }

      const data = await res.json();

      set({
        committeeId: data.committeeId,

        committee: { id: data.committeeId, status: "PENDING", transcript: [] },

        committeeLoading: false,
      });

      get().showToast("Committee launched — debate starting...", "info");

      setTimeout(() => get().startPolling(), 300);

      return data.committeeId;
    } catch (err) {
      console.error(err);

      set({ committeeLoading: false });

      get().showToast("Failed: " + err.message, "error");

      return null;
    }
  },

  pollCommittee: async () => {
    const { committeeId } = get();

    if (!committeeId) return;

    try {
      const res = await fetch(
        "http://localhost:4000/api/committee/" + committeeId,
      );

      if (!res.ok) return;

      const data = await res.json();

      set({ committee: data });

      if (data.status === "COMPLETED") {
        get().stopPolling();

        get().showToast("Committee completed. Verdict ready.", "success");
      }

      if (data.status === "FAILED") {
        get().stopPolling();

        get().showToast("Committee failed", "error");
      }
    } catch (err) {
      console.error(err);
    }
  },

  startPolling: () => {
    get().stopPolling();

    get().pollCommittee();

    const timer = setInterval(() => get().pollCommittee(), 2000);

    set({ pollTimer: timer });
  },

  stopPolling: () => {
    const { pollTimer } = get();

    if (pollTimer) clearInterval(pollTimer);

    set({ pollTimer: null });
  },

  downloadCommitteeReport: () => {
    const { committeeId } = get();

    if (!committeeId) return;

    window.open(
      "http://localhost:4000/api/committee/" + committeeId + "/report.pdf",
      "_blank",
    );

    get().showToast("PDF download started", "info");
  },

  downloadCommitteeReportById: (id) => {
    if (!id) return;

    window.open(
      "http://localhost:4000/api/committee/" + id + "/report.pdf",
      "_blank",
    );

    get().showToast("PDF download started", "info");
  },

  loadCommitteeById: async (id) => {
    try {
      const res = await fetch("http://localhost:4000/api/committee/" + id);

      const data = await res.json();

      set({ committeeId: id, committee: data });
    } catch (err) {
      console.error(err);
    }
  },

  loadCommitteesList: async () => {
    set({ committeesLoading: true });

    try {
      const res = await fetch("http://localhost:4000/api/committee");

      const data = await res.json();

      set({ committeesList: data.committees || [], committeesLoading: false });
    } catch (err) {
      console.error(err);

      set({ committeesLoading: false });
    }
  },
}));
