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
      <header className="border-b border-border px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Braces className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
              DSA <span className="text-gradient">Solver</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>AI-Powered</span>
          </div>
          <a
            href="https://github.com/chetan1930"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        <motion.section
          className="lg:w-[45%] xl:w-[40%] p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-border overflow-visible lg:overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-2 mb-6 p-1 rounded-xl border border-border bg-surface/60">
            <button
              type="button"
              onClick={() => {
                setMode("solver");
                setResult(null);
              }}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                mode === "solver"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-surface-hover"
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
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                mode === "complexity"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-surface-hover"
              }`}
            >
              <Binary className="w-4 h-4 inline mr-2" />
              Complexity Analyzer
            </button>
          </div>

          {mode === "solver" ? (
            <SolveForm onSubmit={handleSolveSubmit} loading={loading} />
          ) : (
            <ComplexityForm onSubmit={handleComplexitySubmit} loading={loading} />
          )}
        </motion.section>

        <motion.section
          className="flex-1 p-4 sm:p-6 overflow-visible lg:overflow-auto"
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
