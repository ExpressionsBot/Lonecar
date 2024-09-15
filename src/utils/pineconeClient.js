import { PineconeClient } from '@pinecone-database/pinecone';

let pinecone;

export const initializePinecone = async () => {
  if (!pinecone) {
    pinecone = new PineconeClient();
    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT, // e.g., 'us-west1-gcp' or your environment
      projectName: process.env.PINECONE_PROJECT_NAME,
    });
  }
  return pinecone;
};