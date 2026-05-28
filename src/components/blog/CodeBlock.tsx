import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Token { text: string; cls?: string }

function tokenize(code: string, lang: string): Token[][] {
  const keywords = new Set([
    "from", "import", "def", "return", "if", "else", "elif", "for", "while",
    "class", "in", "as", "with", "True", "False", "None", "and", "or", "not",
    "const", "let", "var", "function", "await", "async", "new",
  ]);
  return code.split("\n").map((line) => {
    const tokens: Token[] = [];
    // crude regex: comments, strings, numbers, identifiers, punctuation
    const re = /(#[^\n]*|\/\/[^\n]*|"[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|\s+|[^\s])/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      const t = m[0];
      let cls: string | undefined;
      if (/^(#|\/\/)/.test(t)) cls = "text-muted-foreground/70 italic";
      else if (/^["']/.test(t)) cls = "text-emerald-300";
      else if (/^\d/.test(t)) cls = "text-orange-300";
      else if (keywords.has(t)) cls = "text-pink-400";
      else if (/^[A-Z]/.test(t)) cls = "text-cyan";
      else if (/^[A-Za-z_]/.test(t) && line.slice(m.index + t.length).startsWith("(")) cls = "text-yellow-300";
      tokens.push({ text: t, cls });
    }
    return tokens;
  });
}

export function CodeBlock({ code, lang = "python", filename }: { code: string; lang?: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const lines = tokenize(code.trim(), lang);

  const copy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-[oklch(0.13_0.02_260)] shadow-2xl">
      <div className="flex items-center justify-between border-b border-border/60 bg-[oklch(0.18_0.02_260)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-3 font-mono text-xs text-muted-foreground">{filename ?? `${lang}`}</span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13.5px] leading-relaxed">
        <code>
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-5 inline-block w-6 select-none text-right text-muted-foreground/40">{i + 1}</span>
              <span className="flex-1">
                {line.length === 0 ? "\u00a0" : line.map((t, j) => (
                  <span key={j} className={t.cls}>{t.text}</span>
                ))}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
