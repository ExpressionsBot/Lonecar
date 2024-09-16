import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { Pinecone } from '@pinecone-database/pinecone';

async function testPinecone() {
  try {
    console.log('Initializing Pinecone...');
    console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? '*****' : 'Not Set');
    console.log('PINECONE_INDEX_NAME:', process.env.PINECONE_INDEX_NAME);

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    console.log('Pinecone initialized');

    const indexName = process.env.PINECONE_INDEX_NAME;
    console.log('Listing indexes...');
    const indexList = await pinecone.listIndexes();
    console.log('Available indexes:', JSON.stringify(indexList, null, 2));

    const indexExists = indexList.indexes.some(index => index.name === indexName);
    if (!indexExists) {
      throw new Error(`Index "${indexName}" not found. Available indexes: ${indexList.indexes.map(index => index.name).join(', ')}`);
    }

    const index = pinecone.Index(indexName);

    console.log('Upserting test vector...');
    const upsertResponse = await index.upsert([{
      id: 'test-vector',
      values: Array(1536).fill(0.1), // Adjust to match your vector dimensions
      metadata: { text: 'This is a test vector' },
    }]);
    console.log('Upsert response:', JSON.stringify(upsertResponse, null, 2));

    console.log('Querying test vector...');
    const queryResponse = await index.query({
      vector: Array(1536).fill(0.1),
      topK: 1,
      includeMetadata: true,
    });
    console.log('Query response:', JSON.stringify(queryResponse, null, 2));

  } catch (error) {
    console.error('Error during Pinecone testing:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testPinecone();
