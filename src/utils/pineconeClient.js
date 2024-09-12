import { Pinecone } from '@pinecone-database/pinecone';

let pineconeIndex;

export async function initializePinecone() {
  if (pineconeIndex) return pineconeIndex;

  try {
    console.log('Initializing Pinecone...');
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log('Pinecone initialized successfully');
    return pineconeIndex;
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
    throw error;
  }
}

export function getPineconeIndex() {
  if (!pineconeIndex) {
    throw new Error('Pinecone index not initialized');
  }
  return pineconeIndex;
}