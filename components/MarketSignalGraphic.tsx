// Abstract "search visibility network" graphic — not a literal map, so it
// never implies office locations. Pure SVG + CSS animation (no JS/canvas),
// respects prefers-reduced-motion via the global stylesheet rule that
// freezes all animations for users who request it.

const NODES = [
  { x: 62, y: 36, label: "Houston" },
  { x: 30, y: 22, label: "Los Angeles" },
  { x: 88, y: 30, label: "Atlanta" },
  { x: 74, y: 58, label: "Miami" },
  { x: 46, y: 60, label: "Austin" },
  { x: 18, y: 55, label: "Phoenix" },
  { x: 92, y: 68, label: "NYC" },
  { x: 55, y: 12, label: "Chicago" },
];

const LINES: [number, number][] = [
  [0, 4], [0, 2], [4, 5], [1, 5], [2, 6], [4, 3], [7, 0], [7, 2],
];

export default function MarketSignalGraphic() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl" aria-hidden="true">
      <svg viewBox="0 0 100 75" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {LINES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.3"
          />
        ))}

        {NODES.map((node, i) => (
          <g key={node.label}>
            <circle
              cx={node.x}
              cy={node.y}
              r="7"
              fill="url(#nodeGlow)"
              className="origin-center animate-pulse"
              style={{ animationDelay: `${i * 0.35}s`, animationDuration: "3.2s" }}
            />
            <circle cx={node.x} cy={node.y} r="1.4" fill="#fff" />
          </g>
        ))}
      </svg>
    </div>
  );
}
