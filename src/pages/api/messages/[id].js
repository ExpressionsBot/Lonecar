import supabase from '@/utils/supabaseClient';
import initializePinecone from '@/utils/pineconeClient';

let pineconeIndex;

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      if (!pineconeIndex) {
        pineconeIndex = await initializePinecone();
      }

      // Delete message from Supabase
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      if (error) throw error;

      // Delete embedding from Pinecone
      await pineconeIndex.delete1({ ids: [id.toString()] });

      res
        .status(200)
        .json({ message: 'Message and embedding deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
