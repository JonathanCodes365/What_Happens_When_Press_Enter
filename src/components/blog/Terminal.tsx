export function Terminal({ lines }: { lines: { prompt?: string; text: string; out?: boolean }[] }) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-black/70 shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-[oklch(0.14_0.02_260)] px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">zsh — what-happens.sh</span>
      </div>
      <div className="p-5 font-mono text-[13px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={l.out ? "text-muted-foreground" : "text-foreground"}>
            {!l.out && <span className="mr-2 text-cyan">{l.prompt ?? "$"}</span>}
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}
