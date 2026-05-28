import { createFileRoute } from "@tanstack/react-router";
import { BackgroundFX } from "@/components/blog/BackgroundFX";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { Hero } from "@/components/blog/Hero";
import { Sidebar, MobileGlossary } from "@/components/blog/Sidebar";
import { StepCard } from "@/components/blog/StepCard";
import { Callout } from "@/components/blog/Callout";
import { CodeBlock } from "@/components/blog/CodeBlock";
import { Terminal } from "@/components/blog/Terminal";
import { DNSFlow, TCPHandshake, TLSHandshake, HTTPReqRes, Waterfall } from "@/components/blog/Diagrams";
import { Footer } from "@/components/blog/Footer";
import { Reveal } from "@/components/blog/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "What Actually Happens When You Press Enter on a URL? — Ngawang" },
      { name: "description", content: "Understanding what really happens between pressing Enter and seeing a webpage. A deep, visual walkthrough for backend developers." },
      { property: "og:title", content: "What Actually Happens When You Press Enter on a URL?" },
      { property: "og:description", content: "DNS, TCP, TLS, HTTP, rendering — every step, visualized for engineers." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Index,
});

const toc = [
  { id: "intro", label: "Introduction" },
  { id: "step-1", label: "1. Parsing the URL" },
  { id: "step-2", label: "2. DNS Lookup" },
  { id: "step-3", label: "3. TCP Handshake" },
  { id: "step-4", label: "4. TLS Handshake" },
  { id: "step-5", label: "5. HTTP Request" },
  { id: "step-6", label: "6. Server Responds" },
  { id: "step-7", label: "7. Browser Renders" },
  { id: "step-8", label: "8. The Full Picture" },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ReadingProgress />
      <BackgroundFX />

      <nav className="fixed top-0 z-40 w-full glass border-b border-border/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <a href="#" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-cyan" />
            <span className="font-mono text-sm font-semibold tracking-tight">ngawang.dev</span>
          </a>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground">Essays</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Notes</a>
            <a href="#" className="hidden text-muted-foreground hover:text-foreground sm:inline">Bookshelf</a>
            <a href="#" className="rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:border-primary/50">Subscribe</a>
          </div>
        </div>
      </nav>

      <Hero />

      <main className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
          <article className="min-w-0 max-w-3xl">

            <section id="intro" className="scroll-mt-24 mb-16">
              <Reveal>
                <blockquote className="mb-8 border-l-2 border-primary pl-5 text-lg italic text-foreground/85">
                  Most developers skip this. Here's why you shouldn't.
                </blockquote>
                <div className="prose-article">
                  <p>
                    Before I learned Flask, before I wrote a single line of backend code, my teacher asked me a question I couldn't answer:
                  </p>
                  <p className="text-xl font-medium text-foreground">
                    "What actually happens when you type a URL and press Enter?"
                  </p>
                  <p>I said something like "the browser loads the page."</p>
                  <p>He smiled. That was the wrong answer — or at least, a very incomplete one.</p>
                  <p>
                    Here's what I now know happens in that half-second between pressing Enter and seeing a webpage. We'll walk through every layer
                    — from a string of characters in your address bar to pixels lit up on your screen — and along the way I'll point out the bits
                    that matter most when you start writing backend code.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <Terminal
                  lines={[
                    { text: "open https://stripe.com/pricing" },
                    { out: true, text: "→ parsing URL…" },
                    { out: true, text: "→ resolving DNS for stripe.com" },
                    { out: true, text: "→ opening TCP connection to 18.66.x.x:443" },
                    { out: true, text: "→ negotiating TLS 1.3" },
                    { out: true, text: "→ sending GET /pricing" },
                    { out: true, text: "← 200 OK · 142 kB · 612ms" },
                  ]}
                />
              </Reveal>

              <MobileGlossary />
            </section>

            <div className="space-y-10">

              <StepCard
                id="step-1"
                number="STEP 01"
                title="The browser parses the URL"
                subtitle="It's not just text — it's a tiny structured object."
              >
                <p>
                  When you press Enter, the browser tears the URL apart into pieces: the <strong className="text-foreground">scheme</strong>
                  {" "}(<code className="rounded bg-secondary px-1 font-mono text-xs">https</code>), the <strong className="text-foreground">host</strong>{" "}
                  (<code className="rounded bg-secondary px-1 font-mono text-xs">stripe.com</code>), an optional port, a path, a query string,
                  and a fragment. If you typed something that isn't a valid URL, the browser hands it off to your default search engine instead.
                </p>
                <CodeBlock
                  lang="javascript"
                  filename="url-parsing.js"
                  code={`const url = new URL("https://stripe.com/pricing?ref=blog#enterprise");

url.protocol; // "https:"
url.host;     // "stripe.com"
url.pathname; // "/pricing"
url.search;   // "?ref=blog"
url.hash;     // "#enterprise"`}
                />
                <Callout variant="tip" title="Why you should care">
                  Every Flask route you write is matched against <code className="font-mono text-cyan">url.pathname</code>.
                  The browser already did most of the parsing — your framework just dispatches on it.
                </Callout>
              </StepCard>

              <StepCard
                id="step-2"
                number="STEP 02"
                title="DNS turns the name into an address"
                subtitle="The internet doesn't speak in words. It speaks in numbers."
              >
                <p>
                  Servers are reachable by IP address, not by name. So the browser asks: "what IP belongs to{" "}
                  <code className="rounded bg-secondary px-1 font-mono text-xs">stripe.com</code>?" That question travels through a chain of caches
                  before it ever hits a real DNS server.
                </p>
                <DNSFlow />
                <p>
                  Most of the time the answer comes from a cache one or two steps in — your browser's, your OS's, or your ISP's recursive resolver.
                  Only on a cold lookup do you walk all the way up to the root and back down through the TLD.
                </p>
                <Callout variant="info" title="The TTL trick">
                  DNS records have a <strong>TTL</strong> (time-to-live). It's the single most important number when you're migrating servers.
                  Set it low <em>before</em> the migration, not after.
                </Callout>
              </StepCard>

              <StepCard
                id="step-3"
                number="STEP 03"
                title="TCP opens a reliable pipe"
                subtitle="Three packets later, you have a connection."
              >
                <p>
                  Now the browser has an IP. It opens a TCP connection — the protocol that guarantees bytes arrive in order, exactly once, even
                  over an unreliable network. The opening ritual is the famous three-way handshake.
                </p>
                <TCPHandshake />
                <p>
                  Each round-trip costs whatever your latency is. If your server is in Frankfurt and you're in São Paulo, that's ~200ms <em>just</em>
                  {" "}to say hello. This is one reason CDNs exist: terminate TCP closer to the user, then reuse a warm connection to the origin.
                </p>
              </StepCard>

              <StepCard
                id="step-4"
                number="STEP 04"
                title="TLS makes it private"
                subtitle="Because plain HTTP is a postcard. HTTPS is a sealed envelope."
              >
                <p>
                  HTTPS is just HTTP on top of TLS. Before any HTTP byte is sent, both sides exchange a few more messages to agree on a cipher,
                  verify the server's certificate, and derive a shared session key.
                </p>
                <TLSHandshake />
                <Callout variant="warn" title="A subtle gotcha">
                  Self-signed certificates work fine for <code className="font-mono">curl -k</code> but browsers will refuse them.
                  In Flask dev, always test against a real cert (mkcert is your friend) before shipping.
                </Callout>
              </StepCard>

              <StepCard
                id="step-5"
                number="STEP 05"
                title="The browser sends an HTTP request"
                subtitle="A few lines of text — that's all a request really is."
              >
                <p>
                  With an encrypted pipe in place, the browser finally sends what we usually think of as "the request": a method, a path, a stack
                  of headers, and (sometimes) a body. It's plain text. You can read it.
                </p>
                <HTTPReqRes />
                <CodeBlock
                  lang="python"
                  filename="app.py"
                  code={`from flask import Flask, request

app = Flask(__name__)

@app.route("/pricing")
def pricing():
    # Everything you saw on the left is now available here
    print(request.method)        # "GET"
    print(request.headers)       # all those Header: value lines
    print(request.cookies.get("session"))
    return render_template("pricing.html")`}
                />
              </StepCard>

              <StepCard
                id="step-6"
                number="STEP 06"
                title="The server figures out what to send back"
                subtitle="This is where your code finally runs."
              >
                <p>
                  The request hits a load balancer, gets routed to one of many app processes, walks through middleware, matches a route, runs your
                  view function, hits a database, renders a template, and ships bytes back down the same TCP connection — usually compressed,
                  often cacheable.
                </p>
                <Callout variant="tip" title="The whole 'backend' is one step">
                  Everything you spend your day building — auth, ORMs, queues, Redis, S3 — fits inside this single step from the browser's
                  perspective. The browser doesn't care. It just wants bytes.
                </Callout>
                <CodeBlock
                  lang="python"
                  filename="response.py"
                  code={`# What Flask actually sends on the wire
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Cache-Control: public, max-age=3600
Set-Cookie: session=abc123; HttpOnly; Secure
Content-Length: 14302

<!doctype html><html>...</html>`}
                />
              </StepCard>

              <StepCard
                id="step-7"
                number="STEP 07"
                title="The browser renders the page"
                subtitle="Bytes become pixels through a long, beautiful pipeline."
              >
                <p>
                  The HTML arrives as a stream. The browser starts parsing immediately — it doesn't wait for the whole document. As it discovers
                  <code className="mx-1 rounded bg-secondary px-1 font-mono text-xs">&lt;link&gt;</code>,
                  <code className="mx-1 rounded bg-secondary px-1 font-mono text-xs">&lt;script&gt;</code>, and
                  <code className="mx-1 rounded bg-secondary px-1 font-mono text-xs">&lt;img&gt;</code> tags, it fires off more requests in
                  parallel and tries to keep the main thread busy laying out what it already has.
                </p>
                <Waterfall />
                <p>
                  The DOM and CSSOM are built, combined into a render tree, laid out, painted, and composited. Anywhere along this chain a slow
                  font, a render-blocking script, or a giant hero image can ruin everything.
                </p>
              </StepCard>

              <StepCard
                id="step-8"
                number="STEP 08"
                title="The full picture"
                subtitle="Half a second, eight protocols, one moment of magic."
              >
                <p>
                  None of these steps are optional. Skip DNS and you don't know where to go. Skip TCP and your bytes scatter. Skip TLS and the
                  internet reads your password. Skip rendering and you stare at raw HTML.
                </p>
                <p>
                  The reason senior engineers seem to magically know where to look when a request is slow is that they've internalized this map.
                  Now you have it too.
                </p>
                <Callout variant="tip" title="What to do with this">
                  Next time something is slow, ask: <em>which step?</em> DNS resolution? TLS handshake? TTFB (your code)? Asset download? Render?
                  Each one has its own tools, its own fixes, and its own villains.
                </Callout>
              </StepCard>

            </div>
          </article>

          <Sidebar toc={toc} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
