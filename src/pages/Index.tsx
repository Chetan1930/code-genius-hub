import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Binary, Braces, Github, Menu, Sparkles } from "lucide-react";
import ComplexityForm, { type ComplexityFormData } from "@/components/ComplexityForm";
import ResultViewer, { type ResultData } from "@/components/ResultViewer";
import SolveForm, { type FormData } from "@/components/SolveForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { celebrateSuccess } from "@/lib/celebrate";
import { submitComplexity, submitProblem } from "@/lib/api";

type FeatureMode = "solver" | "complexity";

const shellPadding = "px-4 sm:px-6 lg:px-10 xl:px-12";

const Index = () => {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<FeatureMode>("solver");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSolveSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);

    try {
      const nextResult = await submitProblem(data);
      setResult(nextResult);
      if (nextResult.success) {
        queueMicrotask(() => celebrateSuccess());
      }
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
      if (nextResult.success) {
        queueMicrotask(() => celebrateSuccess());
      }
    } catch {
      setResult({
        success: false,
        language: data.language,
        response: "",
        message: "Failed to connect to the complexity server. Please try again.",
        mode: "complexity",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
        {/* Mobile & tablet */}
        <div className={`mx-auto w-full max-w-[1920px] ${shellPadding} lg:hidden`}>
          <div className="flex items-center gap-3 py-3.5 sm:py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/20">
              <Braces className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/90">Developer toolkit</p>
              <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
                DSA <span className="text-gradient">Solver</span>
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/90 bg-surface/80 text-foreground shadow-sm transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="flex w-[min(100%,22rem)] flex-col gap-6 border-border/80 sm:max-w-md">
                  <SheetHeader className="space-y-1 text-left">
                    <SheetTitle className="text-xl font-bold tracking-tight">DSA Solver</SheetTitle>
                    <SheetDescription className="text-sm leading-relaxed">
                      Solve interview problems and analyze complexity from one workspace.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      <Sparkles className="h-3 w-3" />
                      Toolkit
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                      Two tools, one workspace
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-surface/50 p-4">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Binary className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-semibold text-foreground">Solve + complexity</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          Built for interview prep and quick code review.
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://github.com/chetan1930"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface/90 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                  </a>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className={`mx-auto hidden w-full max-w-[1920px] ${shellPadding} lg:block`}>
          <div className="flex flex-row items-start justify-between gap-10 py-5 xl:py-6">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/20">
                <Braces className="w-5 h-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    <Sparkles className="h-3 w-3" />
                    Developer Toolkit
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                    Two tools, one workspace
                  </span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground xl:text-2xl">
                  DSA <span className="text-gradient">Solver</span>
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground xl:text-[15px]">
                  Solve interview problems and analyze code complexity from a single, focused dashboard.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-stretch gap-3 xl:flex-row xl:items-center">
              <div className="hidden min-w-[260px] max-w-sm items-center gap-3 rounded-2xl border border-border/80 bg-surface/55 px-4 py-3 text-sm text-muted-foreground lg:flex">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Binary className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">Problem solving + complexity</p>
                  <p className="text-xs text-muted-foreground">Interview prep and code review</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <a
                  href="https://github.com/chetan1930"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface/85 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-surface-hover hover:text-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
                </a>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto flex w-full max-w-[1920px] flex-1 flex-col gap-6 pb-8 pt-5 sm:gap-7 sm:pb-10 sm:pt-6 lg:flex-row lg:items-stretch lg:gap-8 xl:gap-10 ${shellPadding}`}
      >
        <motion.section
          className="panel-shell w-full min-w-0 rounded-3xl p-4 sm:p-6 lg:max-w-xl lg:flex-[0_1_42%] xl:flex-[0_1_38%]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6">
            <p className="section-badge mb-3">Choose Feature</p>
            <div className="grid grid-cols-1 items-stretch gap-2 rounded-2xl border border-border/80 bg-background/30 p-1.5 sm:grid-cols-2">
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
                <Braces className="mr-2 inline h-4 w-4" />
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
                <Binary className="mr-2 inline h-4 w-4" />
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
          className="panel-shell flex min-h-[min(420px,70vh)] w-full min-w-0 flex-1 flex-col rounded-3xl p-4 sm:min-h-[min(480px,72vh)] sm:p-6 lg:min-h-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
        >
          <ResultViewer result={result} loading={loading} mode={mode} />
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
