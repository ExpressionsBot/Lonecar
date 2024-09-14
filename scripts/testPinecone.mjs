import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Ensure this points to your .env.local file

import { initializePinecone } from '../src/utils/pineconeClient.js';

(async () => {
  try {
    // Optional: Log the variables to verify they are loaded
    console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY);
    console.log('PINECONE_ENVIRONMENT:', process.env.PINECONE_ENVIRONMENT);

    const pinecone = await initializePinecone();
    console.log('Pinecone initialized successfully:', pinecone);
  } catch (error) {
    console.error('Error initializing Pinecone:', error);
  }
})();
