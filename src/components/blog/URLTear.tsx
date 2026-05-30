import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const urls = [
  { scheme: "https", host: "stripe.com", path: "/pricing", query: "?ref=blog", fragment: "#enterprise" },
  { scheme: "http",  host: "localhost:  5000", path: "/api/users", query: "?page=2", fragment: "" },
  { scheme: "https", host: "github.com", path: "/user/repo", query: "", fragment: "#readme" },
];

const parts = [
  { key: "scheme",   label: "scheme",   desc: "Protocol to use",              color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  { key: "host",     label: "host",     desc: "Server to connect to",         color: "text-cyan",       bg: "bg-cyan/10",       border: "border-cyan/20" },
  { key: "path",     label: "path",     desc: "Flask route to match",         color: "text-primary",    bg: "bg-primary/10",    border: "border-primary/20" },
  { key: "query",    label: "query",    desc: "request.args in Flask",        color: "text-orange-300", bg: "bg-orange-300/10", border: "border-orange-300/20" },
  { key: "fragment", label: "fragment", desc: "Browser-only, never sent to server", color: "text-pink-400",   bg: "bg-pink-400/10",   border: "border-pink-400/20" },
] as const;

export function URLTear() {
  const [torn, setTorn] = useState(false);
  const [current, setCurrent] = useState(0);
  const u = urls[current];

  const handleSwitch = (i: number) => { setCurrent(i); setTorn(false); };

  return (
    <div className="my-8 rounded-2xl border border-border bg-card/30 p-6">
      <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        URL parser — click to tear apart
      </p>

      {/* URL Bar */}
      <motion.div
        onClick={() => setTorn(t => !t)}
        animate={{ opacity: torn ? 0.4 : 1 }}
        className="mb-6 flex cursor-pointer flex-wrap items-center rounded-xl border border-border bg-secondary/40 px-4 py-3 font-mono text-sm transition-colors hover:border-primary/40"
      >
        {parts.map(p => (
          <span key={p.key} className={`rounded px-1 ${p.color} ${torn ? "opacity-50" : ""} transition-all`}>
            {p.key === "scheme" ? u.scheme :
             p.key === "host"   ? `://${u.host}` :
             p.key === "path"   ? u.path :
             p.key === "query"  ? u.query :
             u.fragment}
          </span>
        ))}
      </motion.div>

      {/* Torn pieces */}
      <AnimatePresence>
        {torn && (
          <motion.div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {parts.map((p, i) => {
              const val = u[p.key] || "(none)";
              return (
                <motion.div
                  key={p.key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border p-3 ${p.bg} ${p.border}`}
                >
                  <p className={`mb-1 font-mono text-[10px] uppercase tracking-wider ${p.color}`}>{p.label}</p>
                  <p className={`mb-1 font-mono text-sm font-semibold ${p.color}`}>{val}</p>
                  <p className="text-[11px] text-muted-foreground">{p.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* URL switcher */}
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <button
            key={i}
            onClick={() => handleSwitch(i)}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors ${
              current === i
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
            }`}
          >
            {url.scheme}://{url.host}{url.path}
          </button>
        ))}
      </div>
    </div>
  );
}