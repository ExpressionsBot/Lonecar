import supabase from '@/utils/supabaseClient';
import { initializePinecone } from '@/utils/pineconeClient';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Retrieve chat history
      const { chatId } = req.query;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ messages: data });

    case 'DELETE':
      // Delete a specific message and its embedding from Pinecone
      const { id, chatId: delChatId } = req.body;

      try {
        // Delete from Supabase
        const { error: deleteError } = await supabase
          .from('messages')
          .delete()
          .eq('id', id)
          .eq('chat_id', delChatId);

        if (deleteError) throw deleteError;

        // Initialize Pinecone
        const pinecone = await initializePinecone();
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

        // Delete the embedding from Pinecone
        await index.delete1({ ids: [id] });

        return res.status(200).json({ message: 'Message and embedding deleted successfully.' });
      } catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ error: 'Error deleting message.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
