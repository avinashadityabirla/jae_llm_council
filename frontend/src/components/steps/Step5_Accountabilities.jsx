import { useRef, useEffect } from "react";

import MicButton from "../ui/MicButton";

function Step5_Accountabilities({ data, onChange }) {
  const items = data || [];

  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const pushUp = (next) => {
    itemsRef.current = next;

    onChange(next);
  };

  const add = () =>
    pushUp([...itemsRef.current, { accountability: "", actions: [""] }]);

  const remove = (i) => pushUp(itemsRef.current.filter((_, idx) => idx !== i));

  const updateHead = (i, v) =>
    pushUp(
      itemsRef.current.map((a, idx) =>
        idx === i ? { ...a, accountability: v } : a,
      ),
    );

  const appendHead = (i, spoken) => {
    const item = itemsRef.current[i];

    const cur = item.accountability || "";

    const sep = cur && !cur.endsWith(" ") ? " " : "";

    updateHead(i, cur + sep + spoken);
  };

  const updateAction = (i, j, v) =>
    pushUp(
      itemsRef.current.map((a, idx) =>
        idx === i
          ? { ...a, actions: a.actions.map((x, k) => (k === j ? v : x)) }
          : a,
      ),
    );

  const addAction = (i) =>
    pushUp(
      itemsRef.current.map((a, idx) =>
        idx === i ? { ...a, actions: [...a.actions, ""] } : a,
      ),
    );

  const removeAction = (i, j) =>
    pushUp(
      itemsRef.current.map((a, idx) =>
        idx === i ? { ...a, actions: a.actions.filter((_, k) => k !== j) } : a,
      ),
    );

  // Dictate a NEW action line into accountability i

  const appendActionByVoice = (i, spoken) => {
    pushUp(
      itemsRef.current.map((a, idx) => {
        if (idx !== i) return a;

        const acts = [...a.actions];

        // If last action is empty, fill it; otherwise add new line

        if (acts.length > 0 && !acts[acts.length - 1].trim()) {
          acts[acts.length - 1] = spoken.trim();
        } else {
          acts.push(spoken.trim());
        }

        return { ...a, actions: acts };
      }),
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-1">
        Step 6 — Principal Accountabilities
      </h2>

      <p className="text-sm text-neutral-500 mb-4">
        Add 5-10 key accountabilities. Each has supporting actions. Use 🎤 to
        dictate headings or add action lines by voice.
      </p>

      {items.length === 0 && (
        <div className="p-8 text-center border-2 border-dashed border-neutral-300 rounded-lg text-neutral-400 mb-4">
          No accountabilities yet. Click <b>+ Add Accountability</b>.
        </div>
      )}

      {items.map((a, i) => (
        <div
          key={i}
          className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4"
        >
          {/* Heading row with mic */}

          <div className="flex items-center gap-2 mb-3">
            <input
              value={a.accountability}
              onChange={(e) => updateHead(i, e.target.value)}
              placeholder="Accountability heading (e.g. Financial Planning)"
              className="input font-semibold flex-1"
            />

            <MicButton
              onAppend={(s) => appendHead(i, s)}
              title="Dictate heading"
            />

            <button
              onClick={() => remove(i)}
              className="px-3 py-2 bg-danger-light text-danger-dark rounded-lg text-sm font-medium hover:opacity-80"
            >
              Remove
            </button>
          </div>

          {/* Actions */}

          <div className="ml-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Supporting Actions
              </span>

              <MicButton
                onAppend={(s) => appendActionByVoice(i, s)}
                title="Dictate — adds a new action line"
              />
            </div>

            {a.actions.map((act, j) => (
              <div key={j} className="flex items-center gap-2 mb-2">
                <input
                  value={act}
                  onChange={(e) => updateAction(i, j, e.target.value)}
                  placeholder={"Supporting action " + (j + 1)}
                  className="input flex-1"
                />

                <button
                  onClick={() => removeAction(i, j)}
                  className="px-2.5 py-2 bg-danger-light text-danger-dark rounded-lg text-sm hover:opacity-80"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              onClick={() => addAction(i)}
              className="mt-1 px-3 py-1.5 bg-info-light text-info-dark rounded-lg text-xs font-medium hover:opacity-80"
            >
              + Add Action
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="mt-2 px-5 py-2 bg-abc-red text-white rounded-lg font-medium text-sm hover:bg-abc-red-hover"
      >
        + Add Accountability
      </button>
    </div>
  );
}

export default Step5_Accountabilities;
