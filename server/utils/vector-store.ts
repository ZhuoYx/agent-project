export interface VectorDocument {
  id: string;
  text: string; // 原始文本块
  vector: number[]; // embedding 向量
  metadata: {
    source: string; // 文件名
    page?: number; // 页码
    chunkIndex: number; // 文本块索引
  };
}

// 余弦相似度
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;
  for (let i = 0; i < a.length; i++) {
    const aVal = a[i] as number;
    const bVal = b[i] as number;
    dotProduct += aVal * bVal;
    aMagnitude += aVal * aVal;
    bMagnitude += bVal * bVal;
  }
  return dotProduct / (Math.sqrt(aMagnitude) * Math.sqrt(bMagnitude));
}

class VectorStore {
  private docs: VectorDocument[] = [];

  // 批量插入文档
  add(documents: VectorDocument[]) {
    this.docs.push(...documents);
  }

  // 检索最相关的Top-K块
  search(queryVector: number[], k = 4): VectorDocument[] {
    if (this.docs.length === 0) return [];

    return this.docs
      .map(doc => ({
        doc,
        score: cosineSimilarity(queryVector, doc.vector)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(i => i.doc);
  }

  // 清空
  clear() {
    this.docs = [];
  }

  get size() {
    return this.docs.length;
  }
}

// 单例，整个服务端共享
export const vectorStore = new VectorStore();