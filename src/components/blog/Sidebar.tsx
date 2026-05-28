import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TableOfContents, type TocItem } from "./TableOfContents";

const glossary = [
  { term: "DNS", def: "Domain Name System — translates human-readable names into IP addresses." },
  { term: "TCP", def: "Reliable, ordered byte-stream protocol that powers most of the web." },
  { term: "TLS", def: "Cryptographic protocol that secures TCP connections (HTTPS)." },
  { term: "HTTP", def: "Application-layer protocol for exchanging hypertext requests and responses." },
  { term: "IP Address", def: "Numerical label assigned to every device on a network." },
];

const concepts = [
  "DNS is a cache hierarchy, not a single lookup",
  "TCP guarantees delivery; UDP does not",
  "TLS handshake adds 1–2 round trips before HTTP",
  "Browsers parse HTML top-to-bottom, blocking on scripts",
  "Critical render path determines perceived speed",
];

export function Sidebar({ toc }: { toc: TocItem[] }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-8">
        <TableOfContents items={toc} />

        <div className="rounded-xl border border-border bg-card/40 p-5">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan">Key concepts</p>
          <ul className="space-y-2.5">
            {concepts.map((c) => (
              <li key={c} className="flex gap-2 text-sm text-foreground/85">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card/40 p-5">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan">Mini glossary</p>
          <dl className="space-y-3">
            {glossary.map((g) => (
              <div key={g.term}>
                <dt className="text-sm font-semibold text-foreground">{g.term}</dt>
                <dd className="text-xs leading-relaxed text-muted-foreground">{g.def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}

export function MobileGlossary() {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-10 lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card/40 px-5 py-4 text-left"
      >
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan">Mini glossary</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <dl className="mt-3 space-y-3 rounded-xl border border-border bg-card/30 p-5">
          {glossary.map((g) => (
            <div key={g.term}>
              <dt className="text-sm font-semibold text-foreground">{g.term}</dt>
              <dd className="text-xs leading-relaxed text-muted-foreground">{g.def}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
