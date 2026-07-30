import { useRef, useEffect } from "react";

import MicButton from "../ui/MicButton";

function Step2_Purpose({ data, onChange }) {
  const value = data || "";

  const valueRef = useRef(value);

  // Keep ref in sync with latest value

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const appendText = (spoken) => {
    const current = valueRef.current || "";

    const sep = current && !current.endsWith(" ") ? " " : "";

    const next = current + sep + spoken;

    valueRef.current = next;

    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold text-neutral-900">
          Step 2 — Job Purpose
        </h2>

        <MicButton onAppend={appendText} />
      </div>

      <p className="text-sm text-neutral-500 mb-4">
        Explain in 2-3 sentences why this role exists and what it delivers.
        Click the 🎤 to dictate — it will add to existing text.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        placeholder="e.g. Manage large-cap equity portfolio delivering benchmark-beating returns..."
        className="input resize-y w-full"
      />

      <div className="mt-2 text-xs text-neutral-400">
        Character count: {value.length}
      </div>
    </div>
  );
}

export default Step2_Purpose;
