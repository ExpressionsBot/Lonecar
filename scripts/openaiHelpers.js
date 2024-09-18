import initializePinecone, { createEmbedding } from './openaiPineconeFinalFix.mjs';

async function testIntegration() {
    try {
        // Test Pinecone Initialization
        const pineClient = await initializePinecone();
        console.log('Pinecone Client Initialized:', pineClient);

        // Test OpenAI Embedding
        const text = "This is a test input for embeddings.";
        const embedding = await createEmbedding(text);
        console.log('Embedding:', embedding);
    } catch (error) {
        console.error('Error:', error);
    }
}

testIntegration();
