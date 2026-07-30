import { useRef, useEffect } from "react";

import MicButton from "../ui/MicButton";

function Step4_Context({ data, onChange }) {
  const jobContext = data?.jobContext || "";

  const challenges = data?.challenges || [];

  const jobContextRef = useRef(jobContext);

  const challengesRef = useRef(challenges);

  useEffect(() => {
    jobContextRef.current = jobContext;
  }, [jobContext]);

  useEffect(() => {
    challengesRef.current = challenges;
  }, [challenges]);

  const setContext = (v) =>
    onChange({ jobContext: v, challenges: challengesRef.current });

  const appendContext = (spoken) => {
    const current = jobContextRef.current || "";

    const sep = current && !current.endsWith(" ") ? " " : "";

    const next = current + sep + spoken;

    jobContextRef.current = next;

    onChange({ jobContext: next, challenges: challengesRef.current });
  };

  const setChallenges = (text) => {
    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    onChange({ jobContext: jobContextRef.current, challenges: lines });
  };

  const appendChallenge = (spoken) => {
    const current = challengesRef.current || [];

    const next = [...current, spoken.trim()];

    challengesRef.current = next;

    onChange({ jobContext: jobContextRef.current, challenges: next });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
        Step 5 — Context & Challenges
      </h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-neutral-700">
            Job Context
          </label>

          <MicButton onAppend={appendContext} />
        </div>

        <p className="text-xs text-neutral-500 mb-2">
          Describe regulator, market position, and organizational complexity.
        </p>

        <textarea
          value={jobContext}
          onChange={(e) => setContext(e.target.value)}
          rows={5}
          placeholder="e.g. Operates under SEBI mutual fund regulations in a top-5 AMC..."
          className="input resize-y w-full"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-neutral-700">
            Key Challenges (one per line)
          </label>

          <MicButton
            onAppend={appendChallenge}
            title="Dictate a challenge — adds a new line"
          />
        </div>

        <p className="text-xs text-neutral-500 mb-2">
          Enter 3-8 challenges. Type one per line, or use 🎤 to add each as a
          new line.
        </p>

        <textarea
          value={challenges.join("\n")}
          onChange={(e) => setChallenges(e.target.value)}
          rows={8}
          placeholder={
            "Managing volatile equity markets\nComplying with SEBI regulations"
          }
          className="input resize-y w-full"
        />

        <div className="mt-2 text-xs text-neutral-400">
          {challenges.length} challenge{challenges.length === 1 ? "" : "s"}{" "}
          entered
        </div>
      </div>
    </div>
  );
}

export default Step4_Context;
