import { PineconeClient } from '@pinecone-database/pinecone';

export async function initializePinecone() {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  return pinecone;
}