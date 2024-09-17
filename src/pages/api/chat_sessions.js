import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// Check if SUPABASE_SERVICE_ROLE_KEY is set and log first 6 characters
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log('SUPABASE_SERVICE_ROLE_KEY is set:', !!serviceRoleKey);
console.log('First 6 chars of SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? serviceRoleKey.substring(0, 6) + '...' : 'Not available');

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

  if (req.method === 'POST') {
    try {
      console.log('Received POST request to create chat session');

      console.log('Authenticated user:', {
        id: userId,
        email: session.user.email,
      });

      const sessionName = req.body.session_name || 'New Chat Session';

      const insertData = {
        user_id: userId,
        session_name: sessionName,
      };

      console.log('Attempting to insert new chat session with data:', insertData);

      // Insert new chat session into Supabase
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      if (!data) {
        console.error('No data returned from insert operation');
        throw new Error('No data returned from insert operation');
      }

      console.log('Chat session created successfully:', data);
      res.status(200).json({
        message: 'New chat session created successfully',
        session: data,
      });
    } catch (error) {
      console.error('Error in chat session creation:', error);
      res.status(500).json({
        error: 'Failed to create chat session',
        details: error.message,
        code: error.code,
        hint: error.hint,
      });
    }
  } else {
    console.log(`Received unsupported ${req.method} request`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}