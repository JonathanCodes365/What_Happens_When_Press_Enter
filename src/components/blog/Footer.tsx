import { Github, Twitter, Linkedin, Rss, Youtube } from "lucide-react";
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

        //
       

        <Reveal>
          <section className="mb-12 rounded-2xl border border-border bg-card/40 p-8 sm:p-10 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-cyan">Come say hi</p>
            <h3 className="mb-3 text-2xl font-semibold tracking-tight">Let's connect</h3>
            <p className="mb-8 text-foreground/70 max-w-md mx-auto leading-relaxed">
              I'm learning backend development in public — follow along for more articles, videos, and real code.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.open("https://www.youtube.com/@JonathanCodes365", "_blank")}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 hover:border-red-500/40"
              >
                <Youtube className="h-4 w-4 pointer-events-none" />
                YouTube
              </button>
              <button
                onClick={() => window.open("https://github.com/JonathanCodes365", "_blank")}
                className="flex items-center gap-2 rounded-lg bg-secondary border border-border px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary/80 hover:text-foreground"
              >
                <Github className="h-4 w-4 pointer-events-none" />
                GitHub
              </button>
              <button
                onClick={() => window.open("https://x.com/Ngawang_777", "_blank")}
                className="flex items-center gap-2 rounded-lg bg-secondary border border-border px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary/80 hover:text-foreground"
              >
                <Twitter className="h-4 w-4 pointer-events-none" />
                X
              </button>
            </div>
          </section>
        </Reveal>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="font-mono text-xs text-muted-foreground">© 2025 jonathanbuilds · Built for engineers who like to know how things work.</p>
          <div className="flex items-center gap-1">
            {[
              { Icon: Github, url: "https://github.com/JonathanCodes365" },
              { Icon: Twitter, url: "https://x.com/Ngawang_777" },
              { Icon: Linkedin, url: "#" },
              { Icon: Rss, url: "#" },
            ].map(({ Icon, url }, i) => (
              <button
                key={i}
                onClick={() => url !== "#" && window.open(url, "_blank")}
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4 pointer-events-none" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}