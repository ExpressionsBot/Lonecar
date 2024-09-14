import OpenAI from 'openai';
import pinecone from '@pinecone-database/pinecone';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const PineconeClient = pinecone.default;

// OpenAI Configuration
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function createEmbedding(text) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });
    const embedding = response.data[0].embedding;
    return embedding;
}

export { createEmbedding };

// Pinecone Initialization
async function initializePinecone() {
    const pineClient = new PineconeClient();
    await pineClient.init({
        apiKey: process.env.PINECONE_API_KEY || '03cd1e8c-ec2c-490e-b94d-432e20a2ee73',
        environment: 'us-east-1'
    });
    return pineClient;
}

export default initializePinecone;

// Express Server Configuration
const app = express();
const port = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
