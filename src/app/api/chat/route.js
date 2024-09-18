import { NextResponse } from 'next/server';
import { initializePinecone } from '@/utils/pineconeClient';
import { createEmbedding } from '@/utils/openaiHelpers';
import { formatResponse } from '@/utils/apiHelpers';
import OpenAI from 'openai';

// Initialize OpenAI client outside the handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  console.log('Received request in /api/chat');
  try {
    const { message, userId, chatId, context, userProgress } = await request.json();
    console.log('Request body:', { message, userId, chatId, context, userProgress });

    if (!message || !userId || !chatId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Initialize Pinecone
    const pinecone = await initializePinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log('Pinecone initialized');

    // Create embedding
    const embedding = await createEmbedding(message);
    if (!embedding) {
      return NextResponse.json({ error: 'Failed to create embedding' }, { status: 500 });
    }
    console.log('Embedding created');

    // Upsert embedding into Pinecone
    try {
      await index.upsert([{
        id: `${chatId}-${Date.now()}`,
        values: embedding,
        metadata: { text: message, userId },
      }]);
      console.log('Embedding upserted');
    } catch (error) {
      console.error('Error upserting embedding:', error);
      return NextResponse.json({ error: 'Failed to upsert embedding', details: error.message }, { status: 500 });
    }

    // Query Pinecone for relevant context
    const queryResponse = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });
    console.log('Pinecone query completed');

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
    console.log('OpenAI response generated');
    return NextResponse.json(formatResponse(aiResponse));
  } catch (error) {
    console.error('Detailed error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}