import { createEmbedding } from './utils/embeddingFunctions.js';
import { upsertVectors } from './utils/pineconeFunctions.js';

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

// Example usage
addTextToPinecone('example-id', 'This is a sample text to index.');

import { createEmbedding } from './utils/embeddingFunctions.js';
import { queryVector } from './utils/pineconeFunctions.js';

async function findSimilarTexts(text) {
  const embedding = await createEmbedding(text);
  const response = await queryVector(embedding);
  console.log('Query results:', response);
}

// Example usage
findSimilarTexts('Sample text to search for similar entries.');
