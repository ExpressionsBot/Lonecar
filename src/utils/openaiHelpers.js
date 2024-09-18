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
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    
    if (!response.data || !response.data[0] || !response.data[0].embedding) {
      console.error('Invalid response from OpenAI:', response);
      throw new Error('Failed to generate embedding');
    }
    
    const embedding = response.data[0].embedding;
    console.log('Generated embedding:', embedding);
    return embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}
