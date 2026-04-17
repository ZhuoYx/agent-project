import { PDFParse } from 'pdf-parse'

export interface Chunk {
  text: string;
  page?: number;
  chunkIndex: number;
}

const CHUNK_SIZE = 500; // 每个约500字
const OVERLAP = 50; // 相邻块重叠50字

export async function parsePdfToChunks(buffer: Buffer): Promise<Chunk[]> {
  const parsed = new PDFParse(buffer);
  const fullText = (await parsed.getText()).text;

  // 按段落优先切块，超过CHUNK_SIZE再强制切
  const chunks: Chunk[] = [];
  let start = 0;
  let chunkIndex = 0;

  while (start < fullText.length) {
    let end = start + CHUNK_SIZE

    // 尽量再句子边界切断
    if (end < fullText.length) {
      const boundary = fullText.lastIndexOf('。', end);
      if (boundary > start + CHUNK_SIZE / 2) {
        end = boundary + 1;
      }
    }

    const text = fullText.slice(start, end).trim();
    // 过滤太短的块
    if (text.length > 20) {
      chunks.push({ text, chunkIndex });
      chunkIndex++;
    }

    // 滑动窗口，保留重叠部分
    start = end - OVERLAP;
  }

  return chunks;
}