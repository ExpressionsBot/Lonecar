import pinecone from './pineconeClient.js';

const indexName = process.env.PINECONE_INDEX_NAME;
const index = pinecone.Index(indexName);

export async function upsertVectors(vectors) {
  try {
    await index.upsert(vectors);
    console.log(`Upserted ${vectors.length} vector(s) successfully.`);
  } catch (error) {
    console.error('Error upserting vectors:', error);
    throw error;
  }
}

export async function queryVector(vector) {
  try {
    const response = await index.query({
      vector,
      topK: 5,
      includeMetadata: true,
    });
    return response;
  } catch (error) {
    console.error('Error querying vector:', error);
  }
}
