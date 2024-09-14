const { PineconeClient } = require('@pinecone-database/pinecone');

async function initializePinecone() {
  const pinecone = new PineconeClient();
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
  return pinecone;
}

module.exports = { initializePinecone };