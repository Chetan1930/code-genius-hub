import { useState } from "react";
import { motion } from "framer-motion";
import { Binary, Code2, Loader2, Send, Terminal } from "lucide-react";

interface ComplexityFormProps {
  onSubmit: (data: ComplexityFormData) => void;
  loading: boolean;
}

export interface ComplexityFormData {
  language: string;
  code: string;
}

const languages = [
  { label: "C++", value: "cpp" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];

export default function ComplexityForm({ onSubmit, loading }: ComplexityFormProps) {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      language,
      code: code.replace(/\r\n/g, "\n"),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
          <Binary className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Complexity Analyzer</h2>
          <p className="text-sm text-muted-foreground">
            Choose a language and paste your code snippet
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Language
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setLanguage(lang.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  language === lang.value
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "bg-surface border-border text-muted-foreground hover:bg-surface-hover"
                }`}
              >
                <Code2 className="w-3 h-3 inline mr-1.5" />
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 flex-1 flex flex-col">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Source Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Paste your code here...

class Solution {
public:
    bool checkInclusion(std::string s1, std::string s2) {
        // ...
    }
};`}
            required
            className="flex-1 min-h-[240px] sm:min-h-[320px] w-full px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-mono text-sm resize-none"
          />
          <p className="text-xs text-muted-foreground/70">
            Multiline code is sent with normalized <code>\n</code> line breaks in the JSON payload.
          </p>
        </div>

        <motion.button
          type="submit"
          disabled={loading || !code.trim()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-primary-strong hover:brightness-110"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Complexity...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze Code
            </>
          )}
        </motion.button>

        <div className="rounded-lg border border-border bg-surface/50 px-4 py-3 text-xs text-muted-foreground break-all">
          <div className="flex items-center gap-2 font-medium text-foreground mb-1">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            API target
          </div>
          <code>POST http://localhost:8080/api/v1/solve/complexity</code>
        </div>
      </form>
    </motion.div>
  );
}
