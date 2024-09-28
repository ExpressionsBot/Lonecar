import { createEmbedding } from './utils/embeddingFunctions.js';
import { upsertVectors, queryVector } from './utils/pineconeFunctions.js';

async function addTextToPinecone(id, text) {
  const embedding = await createEmbedding(text);
  await upsertVectors([
    {
      id,
      values: embedding,
      metadata: { text },
    },
  ]);
}

async function findSimilarTexts(text) {
  const embedding = await createEmbedding(text);
  const response = await queryVector(embedding);
  console.log('Query results:', response);
}

// Example usage
addTextToPinecone('example-id', 'This is a sample text to index.');
findSimilarTexts('Sample text to search for similar entries.');

export { addTextToPinecone, findSimilarTexts };
