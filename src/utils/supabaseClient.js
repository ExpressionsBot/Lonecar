import { createClient } from '@supabase/supabase-js'; // Import the createClient function from the supabase-js library

// Client-side Supabase URL and anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if the Supabase URL and anon key are available
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client using the URL and anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; // Export the Supabase client as the default export