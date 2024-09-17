import initializePinecone from '../../../src/utils/pineconeClient';
import OpenAI from 'openai';
import supabase from '../../../src/utils/supabaseClient';
import util from 'util';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const { initializePinecone } = require('../../utils/pineconeClient.mjs/index.js');

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = session.user;
  // Proceed with the authenticated user's ID

  if (req.method === 'POST') {
    const { message, userId } = req.body;

    try {
      // Create embedding for the message
      const embedding = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: message,
      });

      // Store message in Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert({ user_id: userId, content: message })
        .select();

      if (error) throw error;

      // Store embedding in Pinecone
      const pinecone = await initializePinecone();
      const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
      await index.upsert([
        {
          id: data[0].id,
          values: embedding.data[0].embedding,
          metadata: { text: message, userId }
        }
      ]);

      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
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
