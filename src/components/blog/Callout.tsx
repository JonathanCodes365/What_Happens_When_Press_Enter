import type { ReactNode } from "react";
import { Lightbulb, Info, AlertTriangle } from "lucide-react";

const variants = {
  tip: { icon: Lightbulb, color: "text-cyan", border: "border-cyan/30", bg: "bg-cyan/5", label: "Insight" },
  info: { icon: Info, color: "text-primary", border: "border-primary/30", bg: "bg-primary/5", label: "Note" },
  warn: { icon: AlertTriangle, color: "text-orange-300", border: "border-orange-300/30", bg: "bg-orange-300/5", label: "Heads up" },
};

export function Callout({ variant = "info", title, children }: { variant?: keyof typeof variants; title?: string; children: ReactNode }) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <div className={`my-8 rounded-xl border ${v.border} ${v.bg} p-5 backdrop-blur-sm`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${v.color}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${v.color}`}>{title ?? v.label}</span>
      </div>
      <div className="text-[15px] leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}
