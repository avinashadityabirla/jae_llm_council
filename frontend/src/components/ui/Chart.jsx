// Simple SVG-based charts — no external dependency needed

export function BarChart({ data, height = 200 }) {
  if (!data || data.length === 0) {
    return <EmptyChart label="No data" />;
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const barWidth = 100 / data.length;

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={"0 0 100 " + height}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * (height - 40);

          const x = i * barWidth + barWidth * 0.15;

          const y = height - 30 - barHeight;

          const w = barWidth * 0.7;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={barHeight}
                fill={d.color || "#8B0000"}
                rx="1"
              />

              <text
                x={x + w / 2}
                y={y - 3}
                textAnchor="middle"
                fontSize="4"
                fill="#374151"
                fontWeight="bold"
              >
                {d.value}
              </text>

              <text
                x={x + w / 2}
                y={height - 15}
                textAnchor="middle"
                fontSize="3.5"
                fill="#6B7280"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function DonutChart({ data, size = 160 }) {
  if (!data || data.length === 0) {
    return <EmptyChart label="No data" />;
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return <EmptyChart label="No data" />;
  }

  const radius = 40;

  const innerRadius = 25;

  const cx = 50;

  const cy = 50;

  let currentAngle = -90;

  const paths = data.map((d, i) => {
    const angle = (d.value / total) * 360;

    const startAngle = currentAngle;

    const endAngle = currentAngle + angle;

    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;

    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);

    const y1 = cy + radius * Math.sin(startRad);

    const x2 = cx + radius * Math.cos(endRad);

    const y2 = cy + radius * Math.sin(endRad);

    const x3 = cx + innerRadius * Math.cos(endRad);

    const y3 = cy + innerRadius * Math.sin(endRad);

    const x4 = cx + innerRadius * Math.cos(startRad);

    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    return (
      <path
        key={i}
        d={
          "M " +
          x1 +
          " " +
          y1 +
          " A " +
          radius +
          " " +
          radius +
          " 0 " +
          largeArc +
          " 1 " +
          x2 +
          " " +
          y2 +
          " L " +
          x3 +
          " " +
          y3 +
          " A " +
          innerRadius +
          " " +
          innerRadius +
          " 0 " +
          largeArc +
          " 0 " +
          x4 +
          " " +
          y4 +
          " Z"
        }
        fill={d.color || "#8B0000"}
      />
    );
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" width={size} height={size}>
        {paths}

        <text
          x="50"
          y="48"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#111827"
        >
          {total}
        </text>

        <text x="50" y="58" textAnchor="middle" fontSize="5" fill="#6B7280">
          Total
        </text>
      </svg>

      <div className="flex flex-col gap-2">
        {data.map((d, i) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;

          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded"
                style={{ background: d.color }}
              />

              <span className="text-neutral-700 font-medium">{d.label}</span>

              <span className="text-neutral-500">
                {d.value} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="w-full h-40 flex items-center justify-center text-neutral-400 text-sm">
      {label}
    </div>
  );
}
