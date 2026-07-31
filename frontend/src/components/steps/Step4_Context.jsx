import { useRef, useEffect, useState } from "react";
import MicButton from "../ui/MicButton";

function Step4_Context({ data, onChange }) {
  const jobContext = data?.jobContext || "";
  const challenges = data?.challenges || [];

  // Local raw text for challenges — prevents trim-on-every-keystroke bug
  const [challengeText, setChallengeText] = useState(challenges.join("\n"));

  const jobContextRef = useRef(jobContext);
  const challengeTextRef = useRef(challengeText);

  useEffect(() => {
    jobContextRef.current = jobContext;
  }, [jobContext]);

  useEffect(() => {
    challengeTextRef.current = challengeText;
  }, [challengeText]);

  // Sync from parent only when the incoming list actually differs
  useEffect(() => {
    const incoming = (challenges || []).join("\n");
    const currentLines = challengeText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .join("\n");
    if (incoming !== currentLines) {
      setChallengeText(incoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.challenges]);

  const pushUp = (nextContext, nextChallengeText) => {
    const lines = (nextChallengeText || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({ jobContext: nextContext, challenges: lines });
  };

  const setContext = (v) => {
    jobContextRef.current = v;
    pushUp(v, challengeTextRef.current);
  };

  const appendContext = (spoken) => {
    const current = jobContextRef.current || "";
    const sep = current && !current.endsWith(" ") ? " " : "";
    const next = current + sep + spoken;
    jobContextRef.current = next;
    pushUp(next, challengeTextRef.current);
  };

  const handleChallengeChange = (text) => {
    setChallengeText(text);
    challengeTextRef.current = text;
    pushUp(jobContextRef.current, text);
  };

  const appendChallenge = (spoken) => {
    const current = challengeTextRef.current || "";
    const sep = current && !current.endsWith("\n") ? "\n" : "";
    const next = current + sep + spoken.trim();
    setChallengeText(next);
    challengeTextRef.current = next;
    pushUp(jobContextRef.current, next);
  };

  const challengeCount = challengeText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean).length;

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
          Enter 3-8 challenges. Type one per line, or use the mic to add each as
          a new line.
        </p>
        <textarea
          value={challengeText}
          onChange={(e) => handleChallengeChange(e.target.value)}
          rows={8}
          placeholder={
            "Managing volatile equity markets\nComplying with SEBI regulations"
          }
          className="input resize-y w-full"
        />
        <div className="mt-2 text-xs text-neutral-400">
          {challengeCount} challenge{challengeCount === 1 ? "" : "s"} entered
        </div>
      </div>
    </div>
  );
}

export default Step4_Context;
