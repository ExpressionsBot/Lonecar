import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Creates an embedding for the given text using OpenAI's API.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]|null>} - The embedding vector or null if an error occurs.
 */
export async function createEmbedding(text) {
  try {
    console.log('Creating embedding for text:', text);
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    console.log('Embedding created successfully');
    return response.data[0].embedding;
  } catch (error) {
    console.error('Detailed error creating embedding:', error);
    return null;
  }
}
