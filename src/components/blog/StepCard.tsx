import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function StepCard({
  id,
  number,
  title,
  subtitle,
  children,
}: {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section
        id={id}
        className="group relative scroll-mt-24 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:bg-card/70 sm:p-10"
      >
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: "var(--shadow-glow)" }} />
        <div className="mb-6 flex items-baseline gap-4">
          <span className="font-mono text-sm text-primary/80">{number}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
        {subtitle && <p className="mb-6 text-base text-muted-foreground">{subtitle}</p>}
        <div className="prose-article">{children}</div>
      </section>
    </Reveal>
  );
}
