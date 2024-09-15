require('dotenv').config();
const { initializePinecone } = require('../src/utils/pineconeClient.mjs');

(async () => {
  try {
    const pinecone = await initializePinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const info = await index.describeIndex();
    console.log('Pinecone index info:', info);
  } catch (error) {
    console.error('Error testing Pinecone:', error);
  }
})();