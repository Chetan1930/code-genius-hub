import type { ComplexityFormData } from "@/components/ComplexityForm";
import type { ResultData } from "@/components/ResultViewer";
import type { FormData } from "@/components/SolveForm";

const API_ORIGIN = "https://api.chetanchauhan.fun";

const SOLVER_ENDPOINT = `${API_ORIGIN}/api/v1/solve`;
export const COMPLEXITY_ENDPOINT = `${API_ORIGIN}/api/v1/solve/complexity`;

async function parseApiResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function submitProblem(data: FormData): Promise<ResultData> {
  const response = await fetch(SOLVER_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      difficulty: data.difficulty,
      language: data.language,
      problem: data.problem,
    }),
  });

  const payload = await parseApiResponse(response);

  if (typeof payload === "string") {
    return {
      success: response.ok,
      response: payload,
      title: data.title,
      language: data.language,
      difficulty: data.difficulty,
      mode: "solver",
      message: response.ok ? "Solution generated successfully." : "The server returned an unexpected response.",
    };
  }

  return {
    ...payload,
    title: payload.title ?? data.title,
    language: payload.language ?? data.language,
    difficulty: payload.difficulty ?? data.difficulty,
    mode: "solver",
  };
}

export async function submitComplexity(data: ComplexityFormData): Promise<ResultData> {
  const normalizedCode = data.code.replace(/\r\n/g, "\n");

  const response = await fetch(COMPLEXITY_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: data.language,
      code: normalizedCode,
    }),
  });

  const payload = await parseApiResponse(response);

  if (typeof payload === "string") {
    return {
      success: response.ok,
      response: payload,
      language: data.language,
      mode: "complexity",
      message: response.ok ? "Complexity analysis complete." : "The server returned an unexpected response.",
    };
  }

  return {
    ...payload,
    language: payload.language ?? data.language,
    mode: "complexity",
  };
}
