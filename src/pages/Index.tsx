import { useState } from "react";
import { motion } from "framer-motion";
import { Braces, Github, Zap } from "lucide-react";
import SolveForm, { type FormData } from "@/components/SolveForm";
import ResultViewer, { type ResultData } from "@/components/ResultViewer";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("https://chetanchauhan.com/api/v1/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          difficulty: data.difficulty,
          language: data.language,
          problem: data.problem,
        }),
      });

      const result = await response.json();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        title: data.title,
        language: data.language,
        difficulty: data.difficulty,
        response: "",
        message: "Failed to connect to the server. Please try again.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Braces className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground tracking-tight">
              DSA <span className="text-gradient">Solver</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

      {/* Main content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left panel - Form */}
        <motion.section
          className="lg:w-[45%] xl:w-[40%] p-6 border-r border-border overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SolveForm onSubmit={handleSubmit} loading={loading} />
        </motion.section>

        {/* Right panel - Result */}
        <motion.section
          className="flex-1 p-6 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ResultViewer result={result} loading={loading} />
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
