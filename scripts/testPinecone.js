require('dotenv').config();
const { initializePinecone } = require('../src/utils/pineconeClient.cjs');

async function testPinecone() {
  try {
    const pinecone = await initializePinecone();
    console.log('Pinecone initialized successfully:', pinecone);
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
  }
}

testPinecone();