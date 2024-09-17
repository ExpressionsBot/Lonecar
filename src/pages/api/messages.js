import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { initializePinecone } from '@/utils/pineconeClient';

export default async function handler(req, res) {
  const supabase = createServerSupabaseClient({ req, res });
  const { method } = req;

  console.log(`Request method: ${method}`);
  console.log(`Request body:`, req.body);
  console.log(`Request query:`, req.query);

  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Log SQL queries (if possible with Supabase)
    const logSqlQuery = (query) => {
      console.log('Executing SQL query:', query);
    };
    supabase.on('query', logSqlQuery);

    // Comprehensive error catching
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
    });

  switch (method) {
    case 'GET':
      // Retrieve chat history
      const { chatId } = req.query;
      if (!chatId) {
        console.error('Missing chatId in GET request');
        return res.status(400).json({ error: 'Missing chatId parameter' });
      }
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('session_id', chatId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ error: 'Failed to fetch conversations', details: error });
      }

      console.log(`Retrieved ${data.length} conversations for chatId: ${chatId}`);
      return res.status(200).json({ conversations: data });

    case 'POST':
      // Add a new message
      const { content, sessionId } = req.body;
      if (!content || !sessionId) {
        console.error('Missing content or sessionId in POST request');
        return res.status(400).json({ error: 'Missing content or sessionId in request body' });
      }
      const { data: newMessage, error: insertError } = await supabase
        .from('conversations')
        .insert({
          content,
          session_id: sessionId,
          user_id: user.id,
          sender: 'user'
        })
        .single();

      if (insertError) {
        console.error('Error inserting message:', insertError);
        return res.status(500).json({ error: 'Failed to insert message', details: insertError });
      }

      console.log('New message added:', newMessage);
      return res.status(200).json({ message: 'Message added successfully', data: newMessage });

    case 'DELETE':
      // Delete a specific message and its embedding from Pinecone
      const { id } = req.query;
      if (!id) {
        console.error('Missing id in DELETE request');
        return res.status(400).json({ error: 'Missing id parameter' });
      }

      try {
        console.log(`Attempting to delete message with id: ${id}`);
        // Delete from Supabase
        const { error: deleteError } = await supabase
          .from('conversations')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error deleting from Supabase:', deleteError);
          throw deleteError;
        }

        // Initialize Pinecone
        const pinecone = await initializePinecone();
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

        // Delete the embedding from Pinecone
        await index.delete1({ ids: [id] });

        console.log(`Message and embedding with id ${id} deleted successfully`);
        return res.status(200).json({ message: 'Message and embedding deleted successfully.' });
      } catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ error: 'Error deleting message.', details: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
