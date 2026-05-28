import { motion } from "motion/react";
import { Clock } from "lucide-react";

export function Hero() {
  return (
    <header className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
          Engineering · Networking · Web fundamentals
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          What Actually Happens<br />
          When You Press <span className="text-gradient">Enter</span> on a URL?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          Understanding what really happens between pressing Enter and seeing a webpage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center gap-5 border-t border-border pt-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan font-mono text-sm font-semibold text-primary-foreground">
              N
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Ngawang</div>
              <div className="text-xs text-muted-foreground">Flask backend developer</div>
            </div>
          </div>
          <span className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            12 min read
          </div>
          <span className="h-6 w-px bg-border" />
          <div className="font-mono text-xs text-muted-foreground">Nov 2025</div>
        </motion.div>
      </div>
    </header>
  );
}
