// backend/ai/azureClient.js
// Shared Azure OpenAI client for JD generation and JAE Committee

const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_DEPLOYMENT =
  process.env.AZURE_OPENAI_DEPLOYMENT || "ABC-PROD-GPT-PTU-ALLBOTS";

export const AZURE_MODEL_LABEL = "Azure OpenAI - " + AZURE_OPENAI_DEPLOYMENT;

function getChatUrl() {
  if (!AZURE_OPENAI_ENDPOINT) {
    throw new Error("AZURE_OPENAI_ENDPOINT is missing in .env");
  }
  const base = AZURE_OPENAI_ENDPOINT.replace(/\/+$/, "");
  return base + "/openai/v1/chat/completions";
}

// Core call — accepts full messages array
export async function azureChat(messages, options = {}) {
  if (!AZURE_OPENAI_API_KEY) {
    throw new Error("AZURE_OPENAI_API_KEY is missing in .env");
  }

  const payload = {
    model: AZURE_OPENAI_DEPLOYMENT,
    messages,
  };

  if (typeof options.temperature === "number") {
    payload.temperature = options.temperature;
  }
  if (typeof options.maxTokens === "number") {
    payload.max_completion_tokens = options.maxTokens;
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 45000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(getChatUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_API_KEY,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        "Azure OpenAI failed with status " + response.status + ": " + errorText
      );
    }

    const data = await response.json();
    return (data.choices?.[0]?.message?.content || "").trim();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === "AbortError") {
      throw new Error("Azure OpenAI call timed out after " + timeoutMs + "ms");
    }
    throw err;
  }
}

// Convenience — system + user prompt
export async function azurePrompt(systemPrompt, userPrompt, options = {}) {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: userPrompt });
  return azureChat(messages, options);
}

// Health check for Settings page
export async function azureHealthCheck() {
  try {
    const text = await azureChat(
      [{ role: "user", content: "ping" }],
      { maxTokens: 10 }
    );
    return {
      status: "ok",
      label: "Connected",
      model: AZURE_OPENAI_DEPLOYMENT,
      endpoint: AZURE_OPENAI_ENDPOINT,
      sample: text.slice(0, 40),
    };
  } catch (err) {
    return {
      status: "down",
      label: "Not reachable",
      model: AZURE_OPENAI_DEPLOYMENT,
      endpoint: AZURE_OPENAI_ENDPOINT,
      error: err.message,
    };
  }
}