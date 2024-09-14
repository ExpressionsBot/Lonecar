import initializePinecone from '@/utils/pineconeClient';

export const getSimilarMessages = async (embedding, userId) => {
  const pineconeIndex = await initializePinecone();

  const queryResponse = await pineconeIndex.query({
    vector: embedding,
    topK: 10,
    includeMetadata: true,
    filter: { user_id: userId.toString() },
  });

  return queryResponse.matches.map(match => match.metadata.text);
};
