import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import OpenAI from 'openai';
import { PineconeClient } from '@pinecone-database/pinecone';
import { formatResponse, handleApiError } from '@/utils/apiHelpers';

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Pinecone client
let pineconeIndex;
const initializePinecone = async () => {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
  return pinecone.Index(process.env.PINECONE_INDEX_NAME);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for authentication headers
    if (!req.headers.authorization) {
      console.warn('Authentication headers missing');
      return res.status(401).json({ error: 'Authentication headers missing' });
    }

    // Initialize Supabase client
    const supabase = createServerSupabaseClient({ req, res });

    // Authenticate user
    let session;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      session = data.session;
    } catch (authError) {
      console.error('Authentication failed:', authError);
      return res.status(401).json({ error: 'Authentication failed', details: authError.message });
    }

    if (!session) {
      console.warn('No active session found');
      return res.status(401).json({ error: 'No active session found' });
    }

    // Parse request body
    const { message, chatId, model = 'gpt-4', context = '', userProgress = {} } = req.body;

    // Validate required fields
    if (!message || !chatId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Pinecone if not already initialized
    if (!pineconeIndex) {
      pineconeIndex = await initializePinecone();
    }

    // Generate message embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Store user message in Supabase
    const { data: messageData, error: messageError } = await supabase
      .from('conversations')
      .insert({
        session_id: chatId,
        role: 'user',
        content: message,
      })
      .select();

    if (messageError) throw messageError;

    // Store embedding in Pinecone
    await pineconeIndex.upsert({
      vectors: [{
        id: messageData[0].id.toString(),
        values: embedding,
        metadata: { text: message }
      }]
    });

    // Retrieve relevant context from Pinecone
    const queryResponse = await pineconeIndex.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true
    });
    const relevantContext = queryResponse.matches.map(match => match.metadata.text).join(" ");

    // Construct system prompt
    const systemPrompt = `You are an AI assistant specialized in ${context}. 
    User's current progress: ${JSON.stringify(userProgress)}. 
    Relevant context: ${relevantContext}`;

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    // Store AI response in Supabase
    const { error: responseError } = await supabase
      .from('conversations')
      .insert({
        session_id: chatId,
        role: 'assistant',
        content: aiResponse,
      });

    if (responseError) throw responseError;

    // Return formatted response
    res.status(200).json(formatResponse(aiResponse));

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
