// backend/agents/agentRunner.js
// Multi-agent framework using Azure OpenAI

import { azureChat } from "../ai/azureClient.js";

const AGENT_TEMPERATURES = {
  business: 0.6,
  hr: 0.4,
  finance: 0.25,
  jaeCoe: 0.3,
};

export function createAgent(kind, systemPrompt) {
  return {
    kind,
    systemPrompt,
    memory: [],
    temperature: AGENT_TEMPERATURES[kind] || 0.4,
  };
}

export async function agentSpeak(agent, taskPrompt, sharedTranscript = []) {
  const messages = [
    { role: "system", content: agent.systemPrompt },
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

  const response = await azureChat(messages, {
    temperature: agent.temperature,
    maxTokens: 400,
  });

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