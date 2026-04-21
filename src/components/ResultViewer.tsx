import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Binary, CheckCircle2, Copy, FileCode2, GitBranch, Sparkles, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ResultViewerProps {
  result: ResultData | null;
  loading: boolean;
  mode?: "solver" | "complexity";
}

export interface ResultData {
  success: boolean;
  response?: string;
  message?: string;
  title?: string;
  language?: string;
  difficulty?: string;
  mode?: "solver" | "complexity";
  [key: string]: unknown;
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <div className="group relative my-3 rounded-xl overflow-hidden border border-border bg-[hsl(var(--code-bg))]">
      <div className="flex items-center justify-between px-4 py-2 bg-[hsl(var(--surface)/0.6)] border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-primary/70" />
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
            {lang || "code"}
          </span>
        </div>
        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-hover))] border border-border hover:border-primary/30 transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1 text-primary"
              >
                <CheckCircle2 className="w-3 h-3" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
        <code className="font-mono text-foreground/90">{children}</code>
      </pre>
    </div>
  );
}

function getExtension(language?: string) {
  const normalized = language?.toLowerCase();

  switch (normalized) {
    case "python":
      return "py";
    case "cpp":
    case "c++":
      return "cpp";
    case "java":
      return "java";
    case "go":
      return "go";
    case "rust":
      return "rs";
    case "javascript":
      return "js";
    case "typescript":
      return "ts";
    default:
      return "txt";
  }
}

function getDisplayResponse(result: ResultData | null) {
  if (!result) {
    return "";
  }

  if (typeof result.response === "string" && result.response.trim().length > 0) {
    return result.response;
  }

  const { response, ...rest } = result;
  const printable = Object.fromEntries(
    Object.entries(rest).filter(([, value]) => value !== undefined && value !== ""),
  );

  return Object.keys(printable).length > 0 ? JSON.stringify(printable, null, 2) : "";
}

export default function ResultViewer({ result, loading, mode = "solver" }: ResultViewerProps) {
  const currentMode = result?.mode ?? mode;
  const displayResponse = getDisplayResponse(result);
  const fileLabel =
    currentMode === "complexity"
      ? `complexity-report.${getExtension(result?.language)}`
      : result?.title
        ? `${result.title}.${getExtension(result.language)}`
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-primary/10 glow-primary">
            {currentMode === "complexity" ? (
              <Binary className="w-5 h-5 text-primary" />
            ) : (
              <FileCode2 className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              {currentMode === "complexity" ? "Complexity Output" : "Solution Output"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentMode === "complexity" ? "Backend complexity analysis" : "AI-generated solution"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[320px] lg:min-h-0 rounded-xl bg-[hsl(var(--code-bg))] border border-border overflow-hidden flex flex-col">
        <div className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[hsl(var(--surface)/0.5)] border-b border-border">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--difficulty-medium)/0.6)]" />
          <div className="w-3 h-3 rounded-full bg-primary/60" />
          {fileLabel && (
            <span className="ml-3 text-xs text-muted-foreground font-mono truncate">
              {fileLabel}
            </span>
          )}
        </div>

        <div className="flex-1 p-3 sm:p-4 overflow-auto">
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
                  <div className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {currentMode === "complexity" ? "Analyzing complexity..." : "Generating solution..."}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currentMode === "complexity"
                      ? "The backend is evaluating the submitted code"
                      : "AI is analyzing the problem"}
                  </p>
                </div>
              </motion.div>
            ) : displayResponse ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {result?.message && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border ${
                      result.success
                        ? "bg-primary/10 border-primary/20"
                        : "bg-destructive/10 border-destructive/20"
                    }`}
                  >
                    <GitBranch className={`w-4 h-4 ${result.success ? "text-primary" : "text-destructive"}`} />
                    <span className={`text-xs font-medium ${result.success ? "text-primary" : "text-destructive"}`}>
                      {result.message}
                    </span>
                  </motion.div>
                )}

                <div className="prose prose-sm prose-invert max-w-none text-foreground/90 [&>h2]:text-foreground [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mt-5 [&>h2]:mb-2 [&>h2]:flex [&>h2]:items-center [&>h2]:gap-2 [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>ul]:text-muted-foreground [&>ol]:text-muted-foreground">
                  {displayResponse.trim().startsWith("{") || displayResponse.trim().startsWith("[") ? (
                    <CodeBlock className="language-json">{displayResponse}</CodeBlock>
                  ) : (
                    <ReactMarkdown
                      components={{
                        code({ className, children, ...props }) {
                          const isBlock = className?.startsWith("language-");
                          if (isBlock) {
                            return (
                              <CodeBlock className={className}>
                                {String(children).replace(/\n$/, "")}
                              </CodeBlock>
                            );
                          }

                          return (
                            <code
                              className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-mono"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                        pre({ children }) {
                          return <>{children}</>;
                        },
                      }}
                    >
                      {displayResponse}
                    </ReactMarkdown>
                  )}
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
                <div className="p-4 rounded-2xl bg-[hsl(var(--surface)/0.5)]">
                  {currentMode === "complexity" ? (
                    <Binary className="w-10 h-10 text-muted-foreground/30" />
                  ) : (
                    <FileCode2 className="w-10 h-10 text-muted-foreground/30" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {currentMode === "complexity" ? "No analysis yet" : "No solution yet"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {currentMode === "complexity"
                      ? "Submit code to inspect its time and space complexity"
                      : "Submit a problem to generate a solution"}
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
