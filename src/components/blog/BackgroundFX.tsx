import { useMemo } from "react";

export function BackgroundFX() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 14,
        size: 1 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute -top-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "var(--gradient-radial)" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.16 230)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.85 0.15 200)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 230)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <line
            key={i}
            x1={`${i * 25}%`}
            y1="0"
            x2={`${i * 25 + 30}%`}
            y2="100%"
            stroke="url(#line-grad)"
            strokeWidth="1"
          >
            <animate
              attributeName="opacity"
              values="0;0.8;0"
              dur={`${6 + i * 1.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.8}s`}
            />
          </line>
        ))}
      </svg>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-cyan/40"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `floatY ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: "0 0 8px oklch(0.85 0.15 200 / 0.6)",
          }}
        />
      ))}
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-40px) translateX(10px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
