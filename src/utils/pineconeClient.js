import { Pinecone } from '@pinecone-database/pinecone';

let pineconeClient;

/**
 * Initializes and returns the Pinecone client.
 * Ensures that only one instance exists (singleton pattern).
 * @returns {Pinecone} - The initialized Pinecone client.
 */
export async function initializePinecone() {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pineconeClient;
}