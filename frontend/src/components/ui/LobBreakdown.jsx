// frontend/src/components/ui/LobBreakdown.jsx

// Clean horizontal-bar breakdown for JDs by LOB

const LOB_COLORS = {
  AMC: "#8B0000",

  NBFC: "#0066CC",

  ABHICL: "#059669",

  ABHFL: "#D4AF37",

  ABFL: "#8B5CF6",
};

function LobBreakdown({ jdsList }) {
  // Count JDs per LOB

  const counts = {};

  (jdsList || []).forEach((jd) => {
    const lob = jd.lob && jd.lob !== "Unknown" ? jd.lob : "Other";

    counts[lob] = (counts[lob] || 0) + 1;
  });

  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  const total = entries.reduce((s, [, c]) => s + c, 0);

  const maxCount = Math.max(...entries.map(([, c]) => c), 1);

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-400 text-sm">
        No JDs yet to break down by LOB
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(([lob, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;

        const barWidth = (count / maxCount) * 100;

        const color = LOB_COLORS[lob] || "#6B7280";

        return (
          <div key={lob}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ background: color }}
                />

                <span className="text-sm font-medium text-neutral-800">
                  {lob}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-neutral-900">{count}</span>

                <span className="text-neutral-400 text-xs">({pct}%)</span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: barWidth + "%", background: color }}
              />
            </div>
          </div>
        );
      })}

      {/* Total footer */}

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs text-neutral-500 uppercase tracking-wider">
          Total JDs
        </span>

        <span className="text-sm font-bold text-neutral-900">{total}</span>
      </div>
    </div>
  );
}

export default LobBreakdown;
