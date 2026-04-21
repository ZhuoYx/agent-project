import { streamText, convertToModelMessages, UIMessage } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event);

  if (vectorStore.size === 0) {
    throw createError({ statusCode: 400, statusMessage: '未上传文件' });
  }

  // 1. 取最新用户问题
  const userMessages = messages.filter((m: UIMessage) => m.role === 'user') as UIMessage[]
  const lastQuestion = userMessages.at(-1)?.parts
    .filter(p => p.type === 'text')
    .map(p => p.text)
    .join('') ?? ''

  // 2. 问题向量化 + 检索
  const queryVector = await embedText(lastQuestion)
  const relevantDocs = vectorStore.search(queryVector, 10)

  // 3. 拼装上下文
  const context = relevantDocs
    .map((doc, i) => `[片段${i + 1} | 来源: ${doc.metadata.source}]\n${doc.text}`)
    .join('\n\n---\n\n')

  const config = useRuntimeConfig()
  const anthropic = createAnthropic({
    baseURL: config.ANTHROPIC_BASE_URL as string,
    apiKey: config.ANTHROPIC_API_KEY as string,
  })

  // 4. 流式回答
  const result = streamText({
    model: anthropic("MiniMax-M2.7-highspeed"),
    system: `你是一个文档回答助手。严格基于以下参考文档回答用户问题，不要编造内容。如果文档中没有相关信息，直接说"文档中未找到相关内容"。回答时注明信息来自哪个片段编号。
      参考文档:
      ${context}`,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
})