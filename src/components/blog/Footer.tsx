import { Github, Twitter, Linkedin, Rss } from "lucide-react";
import { Reveal } from "./Reveal";

const related = [
  { title: "How Flask handles a request, from socket to response", tag: "Flask · 10 min" },
  { title: "WSGI, ASGI, and why your server choice matters", tag: "Python · 8 min" },
  { title: "Caching strategies for backend developers", tag: "Performance · 14 min" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/20">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <section className="mb-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-card/60 to-card/20 p-8 sm:p-10">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan">For Flask developers</p>
            <h3 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">Why this matters</h3>
            <p className="leading-relaxed text-foreground/85">
              When you write <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-cyan">@app.route("/")</code>, you're plugging
              into the very last step of this journey. Knowing what happens before your view function fires — DNS, TCP, TLS, HTTP parsing — makes
              you better at debugging timeouts, designing APIs, and choosing the right caching strategy. Every backend bug you'll ever ship lives
              somewhere on this path.
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16">
            <h3 className="mb-6 text-xl font-semibold tracking-tight">Related reading</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <a
                  key={r.title}
                  href="#"
                  className="group rounded-xl border border-border bg-card/40 p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70"
                >
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{r.tag}</p>
                  <p className="text-sm font-medium leading-snug text-foreground group-hover:text-cyan">{r.title}</p>
                </a>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mb-16 rounded-2xl border border-border bg-card/40 p-8 text-center">
            <h3 className="mb-2 text-2xl font-semibold tracking-tight">Get the next deep-dive in your inbox</h3>
            <p className="mb-6 text-sm text-muted-foreground">One essay every other week. No spam, unsubscribe anytime.</p>
            <form className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@domain.com"
                className="flex-1 rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-primary to-cyan px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          </section>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">© 2025 jonathanbuilds · Built for engineers who like to know how things work.</p>
          <div className="flex items-center gap-1">
            {[Github, Twitter, Linkedin, Rss].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
