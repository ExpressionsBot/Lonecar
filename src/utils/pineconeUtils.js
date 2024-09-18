import { Pinecone } from '@pinecone-database/pinecone';

let pineconeInstance = null;

export const initializePinecone = async () => {
  if (!pineconeInstance) {
    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  return pineconeInstance;
};

export const getPineconeIndex = async () => {
  const pinecone = await initializePinecone();
  return pinecone.Index(process.env.PINECONE_INDEX_NAME);
};

export const upsertVector = async (id, values, metadata) => {
  const pinecone = await initializePinecone();
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  await index.upsert({
    upsertRequest: {
      vectors: [{ id, values, metadata }],
    },
  });
};

export const queryVector = async (vector, topK = 5, userId) => {
  const pinecone = await initializePinecone();
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
  const response = await index.query({
    queryRequest: {
      vector,
      topK,
      includeMetadata: true,
      filter: {
        user_id: userId.toString(),
      },
    },
  });
  return response.matches || [];
};

export const deleteVector = async (id) => {
  const index = await getPineconeIndex();
  return index.deleteOne(id);
};

export const listIndexes = async () => {
  const pinecone = await initializePinecone();
  return pinecone.listIndexes();
};