import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req, res) {
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

  if (req.method === 'GET') {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id parameter' });
    }

    console.log('Fetching conversations for session:', session_id);

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({
          error: 'Failed to fetch conversations',
          details: error.message,
        });
      }

      console.log('Conversations fetched successfully:', data.length);
      res.status(200).json({ conversations: data });
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({
        error: 'An unexpected error occurred',
        details: error.message,
      });
    }
  } else {
    console.log(`Received unsupported ${req.method} request`);
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}