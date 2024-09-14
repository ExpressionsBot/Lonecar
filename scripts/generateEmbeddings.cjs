
const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateEmbeddings = async () => {
  try {
    const pinecone = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT,
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const filesDirectory = '/home/danny/chat_ui/markdown_files';

    // List markdown files
    const files = fs.readdirSync(filesDirectory).filter(file => file.endsWith('.md'));

    // Process each file
    for (const file of files) {
      const filePath = path.join(filesDirectory, file);
      const text = fs.readFileSync(filePath, 'utf-8');
      const chunks = splitTextIntoChunks(text);

      for (const chunk of chunks) {
        const response = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: chunk,
        });
        const embedding = response.data[0].embedding;

        await index.upsert([{ 
          id: `${file}-${chunk.substring(0, 20)}`, // Use first 20 chars of chunk as part of ID
          values: embedding,
          metadata: { text: chunk, source: file }
        }]);
      }

      console.log(`Processed and upserted embeddings for ${file}`);
    }
    
    console.log('All files processed successfully');
  } catch (error) {
    console.error(`Error processing embeddings: ${error.message}`);
  }
};

function splitTextIntoChunks(text, maxLength = 1000) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + maxLength, text.length);
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

generateEmbeddings()
  .then(() => console.log('All files processed successfully'))
  .catch((error) => {
    console.error(`Error processing embeddings: ${error.message}`);
    console.error(error.stack);
  });
