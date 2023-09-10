import fetch from "node-fetch";
import { OPENAI_API_KEY } from "./config";
import { ApiResponseItem } from "./types";

export async function callOpenAiApi(
  promptText: string
): Promise<string | null> {
  const openAiEndpoint: string = "https://api.openai.com/v1/chat/completions"; // Hypothetical endpoint

  if (!OPENAI_API_KEY) {
    console.error("API Key not provided");
    return null;
  }

  try {
    const response = await fetch(openAiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert in cuisines from around the world.",
          },
          {
            role: "user",
            content: promptText,
          },
        ],
        max_tokens: 150, // Example value
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("OpenAI API Error:", response.status, errorBody);
      throw new Error("API response was not ok");
    }

    const data: any = await response.json();

    const assistantMessage = extractAssistantContent(data.choices);

    return assistantMessage;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}

function extractAssistantContent(response: ApiResponseItem[]): string | null {
  const assistantMessage = response.find(
    (item) => item.message.role === "assistant"
  );
  return assistantMessage ? assistantMessage.message.content : null;
}
