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

function complexityObjectLayers(payload: Record<string, unknown>): Record<string, unknown>[] {
  const layers: Record<string, unknown>[] = [payload];
  const push = (v: unknown) => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      layers.push(v as Record<string, unknown>);
    }
  };
  push(payload.data);
  push(payload.result);
  push(payload.analysis);
  return layers;
}

function pickComplexityFields(layers: Record<string, unknown>[]) {
  const pick = (keys: string[]) => {
    for (const obj of layers) {
      for (const key of keys) {
        const v = obj[key];
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          return v;
        }
      }
    }
    return undefined;
  };

  return {
    time: pick([
      "time_complexity",
      "timeComplexity",
      "tc",
      "TC",
      "time",
      "runtime_complexity",
      "runtime",
    ]),
    space: pick([
      "space_complexity",
      "spaceComplexity",
      "sc",
      "SC",
      "space",
      "memory_complexity",
      "auxiliary_space",
    ]),
    explanation: pick([
      "explanation",
      "Explanation",
      "explation",
      "analysis",
      "reasoning",
      "notes",
      "description",
      "details",
    ]),
  };
}

function formatComplexityMarkdown(parts: {
  time: unknown;
  space: unknown;
  explanation: unknown;
}): string {
  const blocks: string[] = [];
  if (parts.time !== undefined) {
    blocks.push(`## Time complexity\n\n${String(parts.time)}`);
  }
  if (parts.space !== undefined) {
    blocks.push(`## Space complexity\n\n${String(parts.space)}`);
  }
  if (parts.explanation !== undefined) {
    blocks.push(`## Explanation\n\n${String(parts.explanation)}`);
  }
  return blocks.join("\n\n");
}

function normalizeComplexityJson(payload: Record<string, unknown>, responseOk: boolean): ResultData {
  const layers = complexityObjectLayers(payload);
  let { time, space, explanation } = pickComplexityFields(layers);

  if (
    time === undefined &&
    space === undefined &&
    explanation === undefined &&
    typeof payload.response === "string" &&
    payload.response.trim() !== ""
  ) {
    explanation = payload.response;
  }

  const body = formatComplexityMarkdown({ time, space, explanation });
  const fallbackError =
    typeof payload.message === "string"
      ? payload.message
      : typeof payload.error === "string"
        ? payload.error
        : "Request failed";

  if (body.trim() === "") {
    return {
      success: typeof payload.success === "boolean" ? payload.success : responseOk,
      mode: "complexity",
      message: responseOk ? undefined : fallbackError,
      response: responseOk ? "" : fallbackError,
    };
  }

  const success = typeof payload.success === "boolean" ? payload.success : responseOk;

  return {
    success,
    mode: "complexity",
    message: success ? undefined : (typeof payload.message === "string" ? payload.message : fallbackError),
    response: body,
  };
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
      message: response.ok ? undefined : "The server returned an unexpected response.",
    };
  }

  return normalizeComplexityJson(payload as Record<string, unknown>, response.ok);
}
