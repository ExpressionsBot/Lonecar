import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import OpenAI from 'openai';
import initializePinecone from '@/utils/pineconeClient';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Initialize Supabase client
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session) {
    console.error('Authentication error:', authError);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = session.user.id;

  try {
    const { message, chatId, userProgress, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message must be a string' });
    }

    if (!chatId) {
      return res.status(400).json({ error: 'Missing chatId in request body' });
    }

    // Initialize Pinecone client
    const pinecone = await initializePinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Create embedding for the message
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    // Store the user message in Supabase
    const { data: messageData, error: insertError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        content: message,
        session_id: chatId,
        sender: 'user',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting message into Supabase:', insertError);
      throw insertError;
    }

    // Store embedding in Pinecone
    await index.upsert({
      upsertRequest: {
        vectors: [
          {
            id: messageData.id,
            values: embedding,
            metadata: { text: message, userId },
          },
        ],
      },
    });

    // Fetch relevant context from Pinecone
    const queryResponse = await index.query({
      queryRequest: {
        vector: embedding,
        topK: 5,
        includeMetadata: true,
      },
    });

    const relevantContext = queryResponse.matches
      .map((match) => match.metadata.text)
      .join(' ');

    // Prepare system prompt
    const systemPrompt = `You are LonestarAI, a premier sales coach and tutor for new employees specializing in door-to-door sales. Your purpose is to ensure they adhere to the latest company guidelines and sales-oriented directives while providing an exceptional user experience.

User's current progress:
${JSON.stringify(userProgress, null, 2)}

Use this progress information to tailor your responses and provide appropriate guidance.

Respond in a conversational and natural tone, avoiding any unnecessary formatting like ## headings and the overuse of bullet points.

Use the following context to inform your response: ${context.join(' ')} ${relevantContext}`;

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    // Store AI response in Supabase
    await supabase.from('conversations').insert({
      user_id: userId,
      content: aiResponse,
      session_id: chatId,
      sender: 'assistant',
    });

    res.status(200).json({ message: aiResponse });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
    });
  }
}