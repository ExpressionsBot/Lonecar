import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { PineconeClient } from '@pinecone-database/pinecone';

// Initialize Pinecone client
let pineconeIndex;
const initializePinecone = async () => {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
  return pinecone.Index(process.env.PINECONE_INDEX_NAME);
};

export default async function handler(req, res) {
  // Initialize Supabase client
  const supabase = createServerSupabaseClient({ req, res });

  // Authenticate user
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  if (authError || !session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGetRequest(req, res, supabase);
        break;
      case 'POST':
        await handlePostRequest(req, res, supabase);
        break;
      case 'DELETE':
        await handleDeleteRequest(req, res, supabase);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetRequest(req, res, supabase) {
  const { chatId } = req.query;

  if (chatId) {
    // Retrieve messages for a specific chat session
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('session_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } else {
    // Retrieve all conversations (from conversations.js functionality)
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  }
}

async function handlePostRequest(req, res, supabase) {
  const { message, chatId, role } = req.body;

  if (!message || !chatId || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      session_id: chatId,
      content: message,
      role: role,
    })
    .select();

  if (error) throw error;
  res.status(201).json(data[0]);
}

async function handleDeleteRequest(req, res, supabase) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing message id' });
  }

  // Delete message from Supabase
  const { error: deleteError } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id);

  if (deleteError) throw deleteError;

  // Initialize Pinecone if not already initialized
  if (!pineconeIndex) {
    pineconeIndex = await initializePinecone();
  }

  // Delete embedding from Pinecone
  await pineconeIndex.delete1({ ids: [id.toString()] });

  res.status(200).json({ message: 'Message and embedding deleted successfully' });
}
