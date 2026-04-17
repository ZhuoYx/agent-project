export async function embedText(text: string, type: 'query' | 'db' = 'query'): Promise<number[]> {
  const config = useRuntimeConfig()
  const res = await fetch(config.ANTHROPIC_EMBEDDING_URL, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${config.ANTHROPIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: 'embo-01',
      texts: [text],
      type,
    }),
  })

  if (!res.ok) {
    const errorText = `Embedding 请求失败：${res.status} ${res.statusText}`
    throw new Error(errorText);
  }

  const data = await res.json();
  return data.data[0].embedding;
}

export async function embedBatch(texts: string[], type: 'query' | 'db' = 'query'): Promise<number[][]> {
  const config = useRuntimeConfig()
  const res = await fetch(config.ANTHROPIC_EMBEDDING_URL, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${config.ANTHROPIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: 'embo-01',
      texts,
      type,
    }),
  })

  if (!res.ok) {
    const errorText = `Embedding 请求失败：${res.status} ${res.statusText}`
    throw new Error(errorText);
  }

  const data = await res.json();
  return data.data.map((item: any) => item.embedding);
}