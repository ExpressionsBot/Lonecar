import { initializePinecone } from '@/utils/pineconeClient';
import { createEmbedding } from '@/utils/openaiHelpers';
import { formatResponse } from '@/utils/apiHelpers';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('Supabase client initialized with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Initialize OpenAI client outside the handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone client
let index;
(async () => {
  const pinecone = await initializePinecone();
  index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
})();

export async function POST(request) {
  // Ensure index is ready
  if (!index) {
    // Handle error or wait
  }

  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);

  try {
    const { message, userId, chatId, context, userProgress } = await request.json();
    console.log(`[${requestId}] Received request:`, {
      message: message ? message.substring(0, 50) + '...' : 'No message content',
      chatId,
      userId,
    });

    if (!message || !userId || !chatId) {
      console.log(`[${requestId}] Missing required fields`);
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // **Insert the user's message into the 'conversations' table**
    const { data: userMessageData, error: userMessageError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        content: message,
        session_id: chatId,
        sender: 'user',
      })
      .select();

    if (userMessageError) {
      console.error(`[${requestId}] Error inserting user message:`, userMessageError);
      throw userMessageError;
    }

    console.log(`[${requestId}] User message inserted successfully.`);

    // **Proceed to generate AI response**
    // Prepare system prompt and generate OpenAI response
    const queryEmbedding = await createEmbedding(message);

    // Verify embedding
    if (!Array.isArray(queryEmbedding)) {
      console.error('Invalid embedding format');
      // Handle error appropriately
    }

    // Query Pinecone for relevant context
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log(`[${requestId}] Pinecone query response:`, { matches: queryResponse.matches.length });

    const relevantContext = queryResponse.matches
      .map((match) => match.metadata.text)
      .join(' ');

    // Prepare system prompt
    const systemPrompt = `You are LonestarAI, a premier sales coach and tutor for new employees specializing in door-to-door sales. Your purpose is to ensure they adhere to the latest company guidelines and sales-oriented directives while providing an exceptional user experience.

User's current progress:
${JSON.stringify(userProgress, null, 2)}

Respond in a conversational and natural tone, avoiding any unnecessary formatting like ## headings and the overuse of bullet points.

Use the following context to inform your response: ${context.join(' ')} ${relevantContext}`;

    // Generate OpenAI response
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    console.log(`[${requestId}] OpenAI response generated:`, {
      content: aiResponse.choices[0].message.content.substring(0, 50) + '...',
    });

    // **Insert the AI's response into the 'conversations' table**
    const { data: aiResponseData, error: aiResponseError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        content: aiResponse.choices[0].message.content,
        session_id: chatId,
        sender: 'assistant',
      })
      .select();

    if (aiResponseError) {
      console.error(`[${requestId}] Error inserting AI response:`, aiResponseError);
      throw aiResponseError;
    }

    console.log(`[${requestId}] AI response inserted successfully.`);

    // **Return a success response**
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`[${requestId}] Error in API route:`, error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}