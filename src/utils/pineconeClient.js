import { Pinecone } from '@pinecone-database/pinecone';

let pinecone = null;

export async function initializePinecone() {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pinecone;
}

export async function getPineconeIndex() {
  const pinecone = await initializePinecone();
  return pinecone.Index(process.env.PINECONE_INDEX_NAME);
}