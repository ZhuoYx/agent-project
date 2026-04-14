import { streamText } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic";

export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event)

  const config = useRuntimeConfig()
  const anthropic = createAnthropic({
    baseURL: config.ANTHROPIC_BASE_URL as string,
    apiKey: config.ANTHROPIC_API_KEY as string,
  })

  const result = streamText({
    model: anthropic("MiniMax-M2.7-highspeed"),
    prompt, // 直接用prompt，不需要convertToModelMessages
  })

  return result.toUIMessageStreamResponse()
})