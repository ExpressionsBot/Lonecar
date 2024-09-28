import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient;
let pineconeIndex;

/**
 * Initializes and returns the Pinecone index.
 * Ensures that only one instance exists (singleton pattern).
 * @returns {Promise<import('@pinecone-database/pinecone').Index>} - The initialized Pinecone index.
 */
export async function initializePinecone() {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  if (!pineconeIndex) {
    pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX_NAME);
  }

  return pineconeIndex;
}