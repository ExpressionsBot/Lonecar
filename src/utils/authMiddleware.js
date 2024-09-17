import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export function withAuth(handler) {
  return async (req, res) => {
    const supabase = createServerSupabaseClient({ req, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({
        error: 'not_authenticated',
        description: 'The user does not have an active session or is not authenticated',
      });
    }

    // Add the user and session to the request object
    req.user = session.user;
    req.session = session;

    // Call the original handler
    return handler(req, res);
  };
}