import { PineconeClient } from '@pinecone-database/pinecone';

let pinecone;

export default async function initializePinecone() {
  if (pinecone) {
    return pinecone;
  }

  pinecone = new PineconeClient();

  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });

  return pinecone;
}