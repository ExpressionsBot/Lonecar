import { initializePinecone, getPineconeIndex } from '@/utils/pineconeClient.js';
import OpenAI from 'openai';
import supabase from '@/utils/supabaseClient.js';

const MESSAGES_TABLE = 'messages';

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function checkRequiredEnvVars() {
  const requiredVars = [
    'OPENAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_INDEX_NAME',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

async function createEmbedding(openai, message) {
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: message,
  });
  return embeddingResponse.data[0].embedding;
}

async function storeMessageInSupabase(supabase, userId, message, chatId) {
  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .insert({ sender: userId, content: message, session_id: chatId })
      .select();
    
    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Supabase insert error: ${JSON.stringify(error)}`);
    }
    if (!data || data.length === 0) {
      throw new Error('No data returned from Supabase insert operation');
    }
    
    return data[0];
  } catch (error) {
    console.error('Error in storeMessageInSupabase:', error);
    throw error;
  }
}

async function storeEmbeddingInPinecone(index, messageId, embedding, message, userId) {
  await index.upsert([
    {
      id: messageId,
      values: embedding,
      metadata: { text: message, userId },
    },
  ]);
}

async function generateAIResponse(openai, message) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: message }],
  });
  return completion.choices[0].message.content;
}

async function storeAIResponseInSupabase(supabase, aiResponse, chatId) {
  const { error } = await supabase
    .from(MESSAGES_TABLE)
    .insert({ sender: 'assistant', content: aiResponse, session_id: chatId });
  
  if (error) {
    console.error('Error storing AI response in Supabase:', error);
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      log('Starting chat handler');
      checkRequiredEnvVars();
      log('Environment variables checked');

      if (!supabase) throw new Error('Supabase client is not initialized');
      log('Supabase client verified');

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      log('OpenAI client initialized');

      log('Initializing Pinecone');
      await initializePinecone();
      log('Pinecone initialized');

      const index = await getPineconeIndex();
      log(`Pinecone index '${process.env.PINECONE_INDEX_NAME}' accessed`);

      // Log the entire request body
      log(`Request body: ${JSON.stringify(req.body)}`);

      // Improved request validation
      const { message, userId = 'anonymous', chatId, context, userProgress } = req.body;
      
      if (!message) {
        log('Missing message in request body');
        return res.status(400).json({ error: 'Missing message in request body' });
      }
      if (typeof message !== 'string') {
        log(`Invalid message type: ${typeof message}`);
        return res.status(400).json({ error: 'Message must be a string' });
      }
      if (!chatId) {
        log('Missing chatId in request body');
        return res.status(400).json({ error: 'Missing chatId in request body' });
      }

      log(`Using userId: ${userId}`);
      if (context) log(`Context provided: ${JSON.stringify(context)}`);
      if (userProgress) log(`User progress provided: ${JSON.stringify(userProgress)}`);

      log('Request data validated successfully');

      log('Creating embedding');
      const embedding = await createEmbedding(openai, message);
      log('Embedding created');

      log('Storing message in Supabase');
      let messageData;
      try {
        messageData = await storeMessageInSupabase(supabase, userId, message, chatId);
        log('Message stored in Supabase');
      } catch (supabaseError) {
        console.error('Error storing message in Supabase:', supabaseError);
        throw supabaseError;
      }

      log('Storing embedding in Pinecone');
      await storeEmbeddingInPinecone(index, messageData.id, embedding, message, userId);
      log('Embedding stored in Pinecone');

      log('Generating AI response');
      const aiResponse = await generateAIResponse(openai, message);
      log('AI response generated');

      log('Storing AI response in Supabase');
      await storeAIResponseInSupabase(supabase, aiResponse, chatId);
      log('AI response stored in Supabase');

      log('Sending response');
      res.status(200).json({ message: aiResponse });
    } catch (error) {
      console.error('Error in API route:', error);
      log(`Error in API route: ${error.message}`);
      if (error.message.includes('Supabase')) {
        console.error('Supabase error details:', JSON.stringify(error));
      }
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}