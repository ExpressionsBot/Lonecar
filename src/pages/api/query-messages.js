import { getPineconeIndex } from '@/utils/pineconeClient';
import { generateEmbedding } from '@/utils/openaiUtils';
import supabase from '@/utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { query_message, userId } = req.body;

    // Generate the embedding for the query message
    const embedding = await generateEmbedding(query_message);

    // Query Pinecone for similar embeddings
    const pineconeIndex = getPineconeIndex();
    const queryResponse = await pineconeIndex.query({
      vector: embedding,
      topK: 10,
      includeValues: true,
      includeMetadata: true,
      filter: { userId: userId }
    });

    const matchingMessages = queryResponse.matches
      .filter(match => match.score >= 0.8)
      .map(match => match.id);

    // Fetch the actual messages from Supabase
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .in('id', matchingMessages)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ messages: data });
  } catch (error) {
    console.error('Error querying messages:', error);
    res.status(500).json({ error: 'An error occurred while querying messages' });
  }
}