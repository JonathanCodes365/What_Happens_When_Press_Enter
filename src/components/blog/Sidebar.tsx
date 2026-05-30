import { useState, useEffect } from "react";
import { ChevronDown, Youtube, Github, Twitter, ExternalLink, BookOpen } from "lucide-react";
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

const further = [
  { title: "How Flask handles a request, from socket to response", tag: "Flask · 10 min", href: "#" },
  { title: "WSGI, ASGI, and why your server choice matters", tag: "Python · 8 min", href: "#" },
  { title: "Caching strategies for backend developers", tag: "Performance · 14 min", href: "#" },
];

const steps = [
  { id: "step-1", label: "URL Parsing" },
  { id: "step-2", label: "DNS Lookup" },
  { id: "step-3", label: "TCP Handshake" },
  { id: "step-4", label: "TLS Handshake" },
  { id: "step-5", label: "HTTP Request" },
  { id: "step-6", label: "Server Responds" },
  { id: "step-7", label: "Browser Renders" },
  { id: "step-8", label: "Full Picture" },
];

function useReadProgress(ids: string[]) {
  const [reached, setReached] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setReached((prev) => new Set([...prev, e.target.id]));
          }
        });
      },
      { rootMargin: "0px 0px -40% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return reached;
}

export function Sidebar({ toc }: { toc: TocItem[] }) {
  const reached = useReadProgress(steps.map((s) => s.id));
  const progress = Math.round((reached.size / steps.length) * 100);

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-6">

        {/* Table of Contents */}
        <TableOfContents items={toc} />

        {/* Reading Progress */}
        <div className="rounded-xl border border-border bg-card/40 p-5">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan">
            Your progress
          </p>
          <div className="mb-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-cyan transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <ul className="space-y-1.5">
            {steps.map((s) => {
              const done = reached.has(s.id);
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                      done ? "bg-primary" : "bg-border"
                    }`}
                  />
                  <span
                    className={`text-xs transition-colors duration-300 ${
                      done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 font-mono text-[10px] text-muted-foreground">
            {progress === 100 ? "🎉 You made it through!" : `${progress}% through the article`}
          </p>
        </div>

        {/* Author Card */}
        <div className="rounded-xl border border-border bg-card/40 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-mono text-sm font-semibold text-primary-foreground">
              J
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">jonathanbuilds</p>
              <p className="text-xs text-muted-foreground">Flask · Backend · YouTube</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground mb-4">
            I write about backend fundamentals the way I wish someone had explained them to me — visually, honestly, with real code.
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => window.open("https://www.youtube.com/@JonathanCodes365", "_blank")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Youtube className="h-4 w-4 pointer-events-none" />
            </button>
            <button
              onClick={() => window.open("https://github.com/JonathanCodes365", "_blank")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Github className="h-4 w-4 pointer-events-none" />
            </button>
            <button
              onClick={() => window.open("https://x.com/Ngawang_777", "_blank")}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Twitter className="h-4 w-4 pointer-events-none" />
            </button>
          </div>
        </div>

        {/* YouTube CTA */}
        <button
          onClick={() => window.open("https://www.youtube.com/@JonathanCodes365", "_blank")}
          className="group flex w-full items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-5 transition-colors hover:border-red-500/40 hover:bg-red-500/10 text-left"
        >
          <Youtube className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground group-hover:text-red-400 transition-colors">
              Watch this on YouTube
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              I walk through every step visually — with animations, terminal demos, and real packet captures.
            </p>
          </div>
        </button>

        {/* Key Concepts */}
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

        {/* Mini Glossary */}
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

        {/* Further Reading */}
        <div className="rounded-xl border border-border bg-card/40 p-5">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" />
            Up next
          </p>
          <ul className="space-y-3">
            {further.map((f) => (
              <li key={f.title}>
                <a
                  href={f.href}
                  className="group flex items-start justify-between gap-2 text-sm text-foreground/85 hover:text-foreground transition-colors"
                >
                  <span className="leading-snug">{f.title}</span>
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{f.tag}</p>
              </li>
            ))}
          </ul>
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