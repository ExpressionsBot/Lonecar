import { initializePinecone } from '@/utils/pineconeClient.js';
import OpenAI from 'openai';
import supabase from '@/utils/supabaseClient.js';
import util from 'util';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message, userId } = req.body;

    try {
      // Initialize Pinecone
      const pinecone = await initializePinecone();
      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

      // Create embedding for the message
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: message,
      });
      const embedding = embeddingResponse.data[0].embedding;

      // Store message in Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({ user_id: userId, content: message })
        .select();

      if (error) throw error;

      // Store embedding in Pinecone
      await index.upsert([
        {
          id: data[0].id,
          values: embedding,
          metadata: { text: message, userId },
        },
      ]);

      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
      });

      const aiResponse = completion.choices[0].message.content;

      // Store AI response in Supabase
      await supabase
        .from('messages')
        .insert({ user_id: 'AI', content: aiResponse });

      res.status(200).json({ message: aiResponse });
    } catch (error) {
      console.error('Error in API route:', util.inspect(error, { depth: null }));
      res.status(500).json({ error: 'Error generating response' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}