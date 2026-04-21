import { useState } from "react";
import { motion } from "framer-motion";
import { Binary, Braces, Github, Zap } from "lucide-react";
import ComplexityForm, { type ComplexityFormData } from "@/components/ComplexityForm";
import ResultViewer, { type ResultData } from "@/components/ResultViewer";
import SolveForm, { type FormData } from "@/components/SolveForm";
import ThemeToggle from "@/components/ThemeToggle";
import { submitComplexity, submitProblem } from "@/lib/api";

type FeatureMode = "solver" | "complexity";

const Index = () => {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<FeatureMode>("solver");

  const handleSolveSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);

    try {
      const nextResult = await submitProblem(data);
      setResult(nextResult);
    } catch {
      setResult({
        success: false,
        title: data.title,
        language: data.language,
        difficulty: data.difficulty,
        response: "",
        message: "Failed to connect to the server. Please try again.",
        mode: "solver",
      });
    }

    setLoading(false);
  };

  const handleComplexitySubmit = async (data: ComplexityFormData) => {
    setLoading(true);
    setResult(null);

    try {
      const nextResult = await submitComplexity(data);
      setResult(nextResult);
    } catch {
      setResult({
        success: false,
        language: data.language,
        response: "",
        message: "Failed to connect to the complexity server. Please make sure localhost:8080 is running.",
        mode: "complexity",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 glow-primary">
              <Braces className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="section-badge mb-1 hidden sm:inline-flex">Developer Workspace</p>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                DSA <span className="text-gradient">Solver</span>
              </h1>
              <p className="hidden sm:block text-sm text-muted-foreground">
                Solve interview problems and inspect complexity in one clean workspace.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-border/80 bg-surface/70 px-3 py-2 text-xs text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>AI-Powered</span>
            </div>
            <a
              href="https://github.com/chetan1930"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-surface/80 border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row">
        <motion.section
          className="panel-shell lg:w-[45%] xl:w-[40%] rounded-3xl p-4 sm:p-6 overflow-visible lg:overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <p className="section-badge mb-3">Choose Feature</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-2 rounded-2xl border border-border/80 bg-background/30 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setMode("solver");
                  setResult(null);
                }}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  mode === "solver"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-surface-hover/80"
                }`}
              >
                <Braces className="w-4 h-4 inline mr-2" />
                Problem Solver
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("complexity");
                  setResult(null);
                }}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                  mode === "complexity"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-surface-hover/80"
                }`}
              >
                <Binary className="w-4 h-4 inline mr-2" />
                Complexity Analyzer
              </button>
            </div>
          </div>

          {mode === "solver" ? (
            <SolveForm onSubmit={handleSolveSubmit} loading={loading} />
          ) : (
            <ComplexityForm onSubmit={handleComplexitySubmit} loading={loading} />
          )}
        </motion.section>

        <motion.section
          className="panel-shell flex-1 rounded-3xl p-4 sm:p-6 overflow-visible lg:overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ResultViewer result={result} loading={loading} mode={mode} />
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
