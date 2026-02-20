import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, FileCode2, GitBranch } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface ResultViewerProps {
  result: ResultData | null;
  loading: boolean;
}

export interface ResultData {
  success: boolean;
  response?: string;
  message?: string;
  title?: string;
  language?: string;
  difficulty?: string;
}

export default function ResultViewer({ result, loading }: ResultViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.response) {
      navigator.clipboard.writeText(result.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
            <FileCode2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Solution Output</h2>
            <p className="text-sm text-muted-foreground">AI-generated solution</p>
          </div>
        </div>
        {result?.response && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-surface border border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground transition-all"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 rounded-xl bg-code-bg border border-border overflow-hidden flex flex-col">
        {/* Tab bar */}
        <div className="flex items-center gap-1 px-4 py-2 bg-surface/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-difficulty-medium/60" />
          <div className="w-3 h-3 rounded-full bg-primary/60" />
          {result?.title && (
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              {result.title}.{result.language === "Python" ? "py" : result.language === "C++" ? "cpp" : result.language === "Java" ? "java" : result.language === "Go" ? "go" : result.language === "Rust" ? "rs" : "ts"}
            </span>
          )}
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-4"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Generating solution...</p>
                  <p className="text-xs text-muted-foreground mt-1">AI is analyzing the problem</p>
                </div>
              </motion.div>
            ) : result?.response ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {result.success && result.message && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                    <GitBranch className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {result.message}
                    </span>
                  </div>
                )}
                <div className="prose prose-sm prose-invert max-w-none text-foreground/90 [&_pre]:bg-surface [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-3 [&_code]:text-primary [&_h2]:text-foreground [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_p]:text-muted-foreground [&_p]:leading-relaxed">
                  <ReactMarkdown>{result.response}</ReactMarkdown>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-center"
              >
                <div className="p-4 rounded-2xl bg-surface/50">
                  <FileCode2 className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">No solution yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Submit a problem to generate a solution
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
