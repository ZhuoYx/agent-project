export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);
  const file = formData.get('file') as File;

  if (!file || file.type !== 'application/pdf') {
    throw createError({ statusCode: 400, statusMessage: '文件类型错误，仅支持PDF' });
  }

  // 清空旧数据(简单实现，实际项目可按文件ID管理)
  // vectorStore.clear();

  // 1. 解析PDF
  const buffer = Buffer.from(await file.arrayBuffer());
  const unit8Array = new Uint8Array(buffer);
  const chunks = await parsePdfToChunks(unit8Array);

  // 2. 批量Embedding
  const BATCH_SIZE = 20;
  const allVectors: number[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const vectors = await embedBatch(batch.map(c => c.text), 'db')
    allVectors.push(...vectors)
  }

  // 3. 存入向量库
  vectorStore.add(
    chunks.map((chunk, i) => ({
      id: `${file.name}-${chunk.chunkIndex}`,
      text: chunk.text,
      vector: allVectors[i] as number[],
      metadata: {
        source: file.name,
        chunkIndex: chunk.chunkIndex,
      },
    }))
  )

  return {
    success: true,
    filename: file.name,
    chunks: chunks.length
  }
})