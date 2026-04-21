import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Loader2, Send, Terminal } from "lucide-react";

interface SolveFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

export interface FormData {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  problem: string;
}

const languages = ["JavaScript", "Python", "C++", "Java", "TypeScript", "Go", "Rust"];

const difficultyConfig = {
  Easy: "bg-difficulty-easy/15 text-difficulty-easy border-difficulty-easy/30",
  Medium: "bg-difficulty-medium/15 text-difficulty-medium border-difficulty-medium/30",
  Hard: "bg-difficulty-hard/15 text-difficulty-hard border-difficulty-hard/30",
};

export default function SolveForm({ onSubmit, loading }: SolveFormProps) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [language, setLanguage] = useState("JavaScript");
  const [problem, setProblem] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, difficulty, language, problem });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 glow-primary">
          <Terminal className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="section-badge mb-2">Problem Input</p>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Problem Input</h2>
          <p className="text-sm text-muted-foreground">Paste your LeetCode prompt and choose the target language.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div className="field-shell space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Problem Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Two Sum"
            required
            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-mono text-sm"
          />
        </div>

        <div className="field-shell space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            {(["Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  difficulty === d
                    ? difficultyConfig[d]
                    : "bg-background/60 border-border text-muted-foreground hover:bg-surface-hover"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="field-shell space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Language
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  language === lang
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-background/60 border-border text-muted-foreground hover:bg-surface-hover"
                }`}
              >
                <Code2 className="w-3 h-3 inline mr-1.5" />
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="field-shell space-y-2 flex-1 flex flex-col">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Problem Description
          </label>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Paste the full problem description here..."
            required
            className="flex-1 min-h-[180px] sm:min-h-[220px] w-full px-4 py-3 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-mono text-sm resize-none"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading || !title || !problem}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-primary-strong hover:brightness-110 shadow-lg shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Solution...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Generate
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
