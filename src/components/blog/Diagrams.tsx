import { motion } from "motion/react";

const cardCls =
  "rounded-lg border border-border bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/50 hover:-translate-y-0.5";

export function DNSFlow() {
  const nodes = ["Browser cache", "OS cache", "Recursive resolver", "Root server", "TLD (.com)", "Authoritative", "IP returned"];
  return (
    <div className="my-8 rounded-2xl border border-border bg-card/30 p-6">
      <p className="mb-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">DNS resolution flow</p>
      <div className="flex flex-wrap items-center gap-2">
        {nodes.map((n, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-2"
          >
            <div className={cardCls}>{n}</div>
            {i < nodes.length - 1 && <span className="text-primary">→</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HandshakeRow({ from, to, label, delay = 0 }: { from: string; to: string; label: string; delay?: number }) {
  const dir = from === "Client" ? "→" : "←";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
    >
      <div className={`text-right text-sm ${from === "Client" ? "text-foreground" : "text-muted-foreground"}`}>
        {from === "Client" ? label : ""}
      </div>
      <div className="font-mono text-primary">{dir}</div>
      <div className={`text-left text-sm ${from === "Server" ? "text-foreground" : "text-muted-foreground"}`}>
        {from === "Server" ? label : ""}
      </div>
    </motion.div>
  );
}

export function TCPHandshake() {
  return (
    <div className="my-8 rounded-2xl border border-border bg-card/30 p-6">
      <p className="mb-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">TCP three-way handshake</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 pb-4">
        <div className="text-center text-xs font-semibold uppercase tracking-wider text-cyan">Client</div>
        <div />
        <div className="text-center text-xs font-semibold uppercase tracking-wider text-cyan">Server</div>
      </div>
      <div className="space-y-4">
        <HandshakeRow from="Client" to="Server" label="SYN — seq=x" delay={0.1} />
        <HandshakeRow from="Server" to="Client" label="SYN-ACK — seq=y, ack=x+1" delay={0.3} />
        <HandshakeRow from="Client" to="Server" label="ACK — ack=y+1" delay={0.5} />
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">Connection established. Both sides agree on sequence numbers.</p>
    </div>
  );
}

export function TLSHandshake() {
  const steps = [
    ["Client", "ClientHello (TLS version, cipher suites, random)"],
    ["Server", "ServerHello + Certificate + ServerKeyExchange"],
    ["Client", "Verify cert → ClientKeyExchange → ChangeCipherSpec"],
    ["Server", "ChangeCipherSpec + Finished"],
  ] as const;
  return (
    <div className="my-8 rounded-2xl border border-border bg-card/30 p-6">
      <p className="mb-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">TLS handshake</p>
      <div className="space-y-3">
        {steps.map(([who, label], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: who === "Client" ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`flex ${who === "Client" ? "justify-start" : "justify-end"}`}
          >
            <div className="max-w-[80%] rounded-lg border border-border bg-card/70 px-4 py-3">
              <div className="mb-1 text-xs font-semibold text-primary">{who}</div>
              <div className="text-sm text-foreground/90">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">Encrypted session key established. All future bytes are encrypted.</p>
    </div>
  );
}

export function HTTPReqRes() {
  return (
    <div className="my-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card/30 p-5 font-mono text-xs leading-relaxed">
        <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-cyan">Request</div>
        <pre className="text-foreground/90">
{`GET /pricing HTTP/1.1
Host: stripe.com
User-Agent: Mozilla/5.0
Accept: text/html
Accept-Encoding: gzip
Cookie: session=…`}
        </pre>
      </div>
      <div className="rounded-2xl border border-border bg-card/30 p-5 font-mono text-xs leading-relaxed">
        <div className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-primary">Response</div>
        <pre className="text-foreground/90">
{`HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Cache-Control: max-age=3600
Server: nginx

<!doctype html>…`}
        </pre>
      </div>
    </div>
  );
}

export function Waterfall() {
  const rows = [
    { label: "document (HTML)", start: 0, width: 18, color: "bg-primary" },
    { label: "style.css", start: 18, width: 14, color: "bg-cyan" },
    { label: "app.js", start: 18, width: 28, color: "bg-blue" },
    { label: "hero.webp", start: 22, width: 22, color: "bg-emerald-400" },
    { label: "font.woff2", start: 24, width: 10, color: "bg-pink-400" },
    { label: "analytics.js", start: 46, width: 18, color: "bg-orange-300" },
    { label: "xhr /api/me", start: 50, width: 24, color: "bg-violet-400" },
  ];
  return (
    <div className="my-8 rounded-2xl border border-border bg-card/30 p-6">
      <p className="mb-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">Network waterfall (browser rendering)</p>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[160px_1fr] items-center gap-3">
            <div className="truncate font-mono text-xs text-muted-foreground">{r.label}</div>
            <div className="relative h-3 rounded bg-border/40">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{ left: `${r.start}%`, width: `${r.width}%`, transformOrigin: "left" }}
                className={`absolute top-0 h-full rounded ${r.color} opacity-80`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-[160px_1fr] gap-3">
        <div />
        <div className="flex justify-between font-mono text-[10px] text-muted-foreground/70">
          <span>0ms</span><span>250ms</span><span>500ms</span><span>750ms</span><span>1s</span>
        </div>
      </div>
    </div>
  );
}
