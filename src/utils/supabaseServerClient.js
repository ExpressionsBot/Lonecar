import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log the first 6 characters of the service role key for debugging
console.log('Service Role Key (first 6 chars):', supabaseServiceRoleKey ? supabaseServiceRoleKey.substring(0, 6) + '...' : 'undefined');

const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabaseServer;
