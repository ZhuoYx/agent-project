import { streamText, convertToModelMessages } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);

  const config = useRuntimeConfig()
  const anthropic = createAnthropic({
    baseURL: config.ANTHROPIC_BASE_URL as string,
    apiKey: config.ANTHROPIC_API_KEY as string,
  })

  const result = streamText({
    model: anthropic("MiniMax-M2.7-highspeed"),
    system: "你是一个简洁的助手，用中文回答。",
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
})