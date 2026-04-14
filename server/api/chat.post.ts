import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

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
    stopWhen: stepCountIs(5),
    tools: {
      get_weather: tool({
        title: 'get_weather',
        description: "查询指定城市的天气",
        inputSchema: z.object({
          city: z.string().describe("城市名称"),
        }),
        execute: async ({ city }) => {
          await new Promise(r => setTimeout(r, 5000))
          return { city, temp: 28, desc: "晴" }
        }
      })
    }
  })

  return result.toUIMessageStreamResponse()
})