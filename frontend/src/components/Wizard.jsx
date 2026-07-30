import { useJDStore } from "../store/useJDStore";

import Step1_Basic from "./steps/Step1_Basic";

import Step2_Purpose from "./steps/Step2_Purpose";

import Step3_Dimensions from "./steps/Step3_Dimensions";

import Step4_BusinessContext from "./steps/Step4_BusinessContext";

import Step5_Context from "./steps/Step4_Context";

import Step6_Accountabilities from "./steps/Step5_Accountabilities";

import Step7_DirectReports from "./steps/Step7_DirectReports";

import Step8_Relationships from "./steps/Step6_Relationships";

import Step9_SignOff from "./steps/Step8_SignOff";

const STEPS = [
  { n: 1, label: "Basic Details" },

  { n: 2, label: "Job Purpose" },

  { n: 3, label: "Dimensions" },

  { n: 4, label: "Business Context" },

  { n: 5, label: "Job Context" },

  { n: 6, label: "Accountabilities" },

  { n: 7, label: "Reporting Structure" },

  { n: 8, label: "Relationships" },

  { n: 9, label: "Sign-Off" },
];

function Wizard({ onBack, onLaunchCommittee }) {
  const currentStep = useJDStore((s) => s.currentStep);

  const setStep = useJDStore((s) => s.setStep);

  const saving = useJDStore((s) => s.saving);

  const generating = useJDStore((s) => s.generating);

  const message = useJDStore((s) => s.message);

  const currentJdId = useJDStore((s) => s.currentJdId);

  const wizardData = useJDStore((s) => s.wizardData);

  const generatedJd = useJDStore((s) => s.generatedJd);

  const updateSection = useJDStore((s) => s.updateSection);

  const saveWizard = useJDStore((s) => s.saveWizard);

  const generateJD = useJDStore((s) => s.generateJD);

  const downloadJD = useJDStore((s) => s.downloadJD);

  const handleNext = async () => {
    const ok = await saveWizard();

    if (ok && currentStep < STEPS.length) setStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setStep(currentStep - 1);
  };

  const handleGenerate = async () => {
    await saveWizard();

    await generateJD();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Basic
            data={wizardData.basic}
            onChange={(v) => updateSection("basic", v)}
          />
        );

      case 2:
        return (
          <Step2_Purpose
            data={wizardData.jobPurpose}
            onChange={(v) => updateSection("jobPurpose", v)}
          />
        );

      case 3:
        return (
          <Step3_Dimensions
            data={wizardData.dimensions}
            onChange={(v) => updateSection("dimensions", v)}
          />
        );

      case 4:
        return (
          <Step4_BusinessContext
            data={wizardData.businessContext}
            basic={wizardData.basic}
            onChange={(v) => updateSection("businessContext", v)}
          />
        );

      case 5:
        return (
          <Step5_Context
            data={{
              jobContext: wizardData.jobContext,

              challenges: wizardData.challenges,
            }}
            onChange={(v) => {
              updateSection("jobContext", v.jobContext);

              updateSection("challenges", v.challenges);
            }}
          />
        );

      case 6:
        return (
          <Step6_Accountabilities
            data={wizardData.accountabilities}
            onChange={(v) => updateSection("accountabilities", v)}
          />
        );

      case 7:
        return (
          <Step7_DirectReports
            data={{
              managerAbove: wizardData.managerAbove,

              reportees: wizardData.reportees,

              hasNoReportees: wizardData.hasNoReportees,

              orgRelationships: wizardData.orgRelationships,
            }}
            basic={wizardData.basic}
            onChange={(v) => {
              updateSection("managerAbove", v.managerAbove);

              updateSection("reportees", v.reportees);

              updateSection("hasNoReportees", v.hasNoReportees);

              updateSection("orgRelationships", v.orgRelationships);
            }}
          />
        );

      case 8:
        return (
          <Step8_Relationships
            data={wizardData.relationships}
            onChange={(v) => updateSection("relationships", v)}
          />
        );

      case 9:
        return (
          <Step9_SignOff
            data={wizardData.signOff}
            onChange={(v) => updateSection("signOff", v)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button onClick={onBack} className="btn-secondary text-sm mb-4">
        ← Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-abc-red">JD Wizard</h1>

        <div className="text-sm text-neutral-500">
          {currentJdId
            ? "Editing JD: " + currentJdId.slice(0, 8) + "..."
            : "New JD"}
        </div>
      </div>

      {/* Step chips */}

      <div className="flex flex-wrap gap-2 mb-6">
        {STEPS.map((s) => (
          <button
            key={s.n}
            onClick={() => setStep(s.n)}
            className={
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors " +
              (currentStep === s.n
                ? "bg-abc-red text-white"
                : currentStep > s.n
                  ? "bg-success-light text-success-dark"
                  : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300")
            }
          >
            {s.n}. {s.label}
          </button>
        ))}
      </div>

      {/* Step content */}

      <div className="card p-6 min-h-[300px]">{renderStep()}</div>

      {/* Navigation buttons */}

      <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={
            "px-5 py-2.5 rounded-lg font-medium text-sm text-white " +
            (currentStep === 1
              ? "bg-neutral-300 cursor-not-allowed"
              : "bg-neutral-600 hover:bg-neutral-700")
          }
        >
          ← Back
        </button>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={handleGenerate}
            disabled={generating || saving}
            className={
              "px-5 py-2.5 rounded-lg font-medium text-sm text-white " +
              (generating ? "bg-neutral-500" : "bg-info hover:opacity-90")
            }
          >
            {generating ? "Generating..." : "Generate JD (AI)"}
          </button>

          {generatedJd && (
            <button
              onClick={downloadJD}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-success hover:opacity-90"
            >
              📄 Download Word
            </button>
          )}

          {generatedJd && (
            <button
              onClick={onLaunchCommittee}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-purple-600 hover:opacity-90"
            >
              ⚖️ Launch JAE Committee →
            </button>
          )}

          {generatedJd && (
            <button
              onClick={async () => {
                const ok = await useJDStore.getState().finalizeJd();

                if (ok) onBack();
              }}
              className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-success hover:opacity-90"
            >
              ✓ Finalize JD
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={saving || generating}
            className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-abc-red hover:bg-abc-red-hover"
          >
            {saving
              ? "Saving..."
              : currentStep < STEPS.length
                ? "Save & Next →"
                : "Save & Finish"}
          </button>
        </div>
      </div>

      {/* Status message */}

      {message && (
        <div
          className={
            "mt-4 px-4 py-3 rounded-lg text-sm font-medium " +
            (message.includes("Error") || message.includes("failed")
              ? "bg-danger-light text-danger-dark"
              : "bg-success-light text-success-dark")
          }
        >
          {message}
        </div>
      )}

      {/* AI Preview */}

      {generatedJd && (
        <div className="card p-6 mt-8 border-2 border-info">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
            <h2 className="text-lg font-bold text-info">
              AI-Generated JD (Preview)
            </h2>

            <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
              Model: {generatedJd.model}
            </span>
          </div>

          <PreviewSection
            title="Job Purpose"
            content={generatedJd.jobPurpose}
          />

          <PreviewSection
            title="Organisation Context"
            content={generatedJd.orgContext}
          />

          <PreviewSection
            title="Job Context"
            content={generatedJd.jobContext}
          />

          <PreviewSection
            title="Key Challenges"
            content={generatedJd.challenges}
          />

          {generatedJd.accountabilities &&
            generatedJd.accountabilities.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-neutral-800 border-l-4 border-info pl-2 mb-2">
                  Principal Accountabilities
                </h3>

                {generatedJd.accountabilities.map((a, i) => (
                  <div key={i} className="mb-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="font-semibold text-neutral-900 text-sm">
                      {a.accountability}
                    </div>

                    <ul className="mt-2 ml-4 list-disc text-sm text-neutral-700">
                      {(a.actions || []).map((act, j) => (
                        <li key={j}>{act}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

          {generatedJd.directReports &&
            generatedJd.directReports.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-neutral-800 border-l-4 border-info pl-2 mb-2">
                  Direct Reports
                </h3>

                {generatedJd.directReports.map((dr, i) => (
                  <p key={i} className="text-sm text-neutral-700 mb-1">
                    <b>{dr.role}</b> — {dr.purpose}
                  </p>
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

function PreviewSection({ title, content }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-neutral-800 border-l-4 border-info pl-2 mb-2">
        {title}
      </h3>

      <div className="bg-neutral-50 p-3 rounded-lg text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
        {content || "(Not generated)"}
      </div>
    </div>
  );
}

export default Wizard;
