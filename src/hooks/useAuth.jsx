import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from 'react'
import supabase from '@/utils/supabaseClient'; // Import supabase from the utility file

export function useAuth() {
  const [session, setSession] = useState(null); // State to store the current session
  const [loading, setLoading] = useState(true); // State to manage the loading state

  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes in the authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Update the session state on change
      setLoading(false); // Set loading to false on change
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return { session, loading }; // Return the session and loading states
}