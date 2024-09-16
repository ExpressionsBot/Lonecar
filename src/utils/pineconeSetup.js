import { Pinecone } from "@pinecone-database/pinecone";

let indexSetup = false;
/** @type Pinecone */
let pinecone;

export async function getPinecone() {
  if (!pinecone) {
    pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  }

  if (!indexSetup) {
    indexSetup = await setupIndex(pinecone, process.env.PINECONE_INDEX_NAME);
    if (!indexSetup) {
      throw new Error("Failed to set up Pinecone index");
    }
  }

  return pinecone;
}

/**
 * Create the Pinecone index if it doesn't exist.
 *
 * @param {Pinecone} pinecone
 * @param {string} indexName
 * @returns {boolean}
 */
async function setupIndex(pinecone, indexName) {
  try {
    console.log(`Creating Pinecone index named: ${indexName} if necessary`);

    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // Dimension for OpenAI embeddings
      metric: "cosine",
      // Don't return an error if the target Index already exists
      suppressConflicts: true,
      // Wait until the index is ready before returning success
      waitUntilReady: true,
    });

    console.log(`Pinecone index ${indexName} is ready`);
    return true;
  } catch (err) {
    console.error("Error creating index", err);
    return false;
  }
}