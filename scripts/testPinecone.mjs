import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Ensure this points to your .env.local file

import { initializePinecone } from '../src/utils/pineconeClient.js';

async function testPinecone() {
  try {
    const pinecone = await initializePinecone();
    console.log('Pinecone initialized:', pinecone);
    // You can add additional tests or operations here
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
  }
}

testPinecone();
