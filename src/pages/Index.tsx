import { useState } from "react";
import { motion } from "framer-motion";
import { Braces, Zap } from "lucide-react";
import SolveForm, { type FormData } from "@/components/SolveForm";
import ResultViewer, { type ResultData } from "@/components/ResultViewer";

const Index = () => {
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);

    // Simulate API call (replace with real backend)
    await new Promise((r) => setTimeout(r, 2500));

    setResult({
      success: true,
      title: data.title,
      language: data.language,
      difficulty: data.difficulty,
      solution: `// ${data.title} - ${data.difficulty}
// Language: ${data.language}

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Time Complexity: O(n)
// Space Complexity: O(n)`,
      message: "Solution generated and pushed to GitHub",
    });

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
              LeetCode <span className="text-gradient">Archiver</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span>AI-Powered</span>
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
