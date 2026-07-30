// backend/agents/agentRunner.js

// Multi-agent framework — one Ollama, many personas

const OLLAMA_URL = "http://localhost:11434/api/chat";

const MODEL = "llama3.1:8b";

const AGENT_TEMPERATURES = {
  business: 0.6,

  hr: 0.4,

  finance: 0.25,

  jaeCoe: 0.3,
};

async function callOllama(messages, temperature = 0.4) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({
      model: MODEL,

      messages,

      stream: false,

      options: { temperature, num_predict: 180 },
    }),
  });

  if (!response.ok) {
    throw new Error("Ollama call failed: " + response.status);
  }

  const data = await response.json();

  return (data.message?.content || "").trim();
}

export function createAgent(kind, systemPrompt) {
  return {
    kind,

    systemPrompt,

    memory: [],

    temperature: AGENT_TEMPERATURES[kind] || 0.4,
  };
}

// Agent speaks — includes shared context of what everyone said + agent's own memory

export async function agentSpeak(agent, taskPrompt, sharedTranscript = []) {
  const messages = [
    { role: "system", content: agent.systemPrompt },

    // Inject shared transcript as user context

    {
      role: "user",

      content:
        sharedTranscript.length > 0
          ? "DISCUSSION SO FAR:\n" +
            sharedTranscript

              .map((t) => `[${t.agentName}]: ${t.msg}`)

              .join("\n\n") +
            "\n\nYOUR TASK NOW:\n" +
            taskPrompt
          : taskPrompt,
    },
  ];

  const response = await callOllama(messages, agent.temperature);

  agent.memory.push({ task: taskPrompt, response });

  return response;
}

export function parseJSON(text, fallback = null) {
  try {
    const match =
      text.match(/```json([\s\S]*?)```/) ||
      text.match(/```([\s\S]*?)```/) ||
      text.match(/(\{[\s\S]*\})/);

    const raw = match ? match[1] || match[0] : text;

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
