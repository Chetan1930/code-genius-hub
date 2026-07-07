import { motion } from "framer-motion";
import { ArrowRight, Binary, Braces, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onSelect: (mode: "solver" | "complexity") => void;
}

const features = [
  {
    id: "solver" as const,
    icon: Braces,
    title: "Solve a Problem",
    tagline: "Get a full solution",
    description:
      "Paste any DSA / LeetCode problem and get a clean, explained solution in your favorite language.",
    bullets: ["Multiple languages", "Step-by-step approach", "Ready-to-copy code"],
    accent: "from-primary/25 to-primary/5",
  },
  {
    id: "complexity" as const,
    icon: Binary,
    title: "Analyze Complexity",
    tagline: "Understand your code",
    description:
      "Paste an existing snippet and get a detailed time & space complexity breakdown with reasoning.",
    bullets: ["Time & space analysis", "Line-by-line reasoning", "Optimization hints"],
    accent: "from-difficulty-medium/25 to-difficulty-medium/5",
  },
];

export default function WelcomeScreen({ onSelect }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-4">
            <Sparkles className="h-3 w-3" />
            Welcome
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
            What would you like to do?
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Pick a tool to get started. You can switch anytime from the top bar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.id}
                type="button"
                onClick={() => onSelect(feature.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative text-left rounded-3xl border border-border/80 bg-surface/60 backdrop-blur-xl p-6 sm:p-7 transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
              >
                <div
                  className={`absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br ${feature.accent} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80 mb-1.5">
                      {feature.tagline}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      {feature.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="flex flex-wrap gap-2 pt-2">
                    {feature.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-[11px] font-medium text-muted-foreground bg-background/60 border border-border/70 rounded-full px-2.5 py-1"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground/70 mt-8"
        >
          Your choice and inputs are remembered on this device.
        </motion.p>
      </div>
    </div>
  );
}
