"use client";

// Import necessary hooks and components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import supabase from '@/utils/supabaseClient';

export default function SignupPage() {
  // State to manage feedback messages
  const [feedback, setFeedback] = useState('');
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);
  // State to manage modal visibility
  const [isModalVisible, setIsModalVisible] = useState(true);
  // Router instance from Next.js
  const router = useRouter();

  // Function to handle signup
  const handleSignup = async (email, password) => {
    setIsLoading(true);
    try {
      // Attempt to sign up with email and password
      const { data: signUpData, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setFeedback(error.message);
      } else {
        // Wait for the session to be established
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setFeedback('Could not retrieve user session.');
          return;
        }

        const user = session.user;

        // Insert the user into the 'users' table
        const { data: newUser, error: insertUserError } = await supabase
          .from('users')
          .insert({ id: user.id, email: user.email })
          .select()
          .single();

        if (insertUserError) {
          console.error('Error inserting user:', insertUserError);
          setFeedback('Error inserting user into database.');
        } else {
          // Redirect to chat page on successful signup
          router.push('/chat');
        }
      }
    } catch (error) {
      setFeedback('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle modal closing
  const closeModal = () => {
    setIsModalVisible(false);
    router.push('/');
  };

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/chat');
      }
    });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-navy text-light-gray p-4" role="main" aria-label="Sign up page">
      <AuthModal 
        isSignup={true} 
        isVisible={isModalVisible} 
        closeModal={closeModal} 
        onSuccess={handleSignup}
      />
      {feedback && <div className="mt-4 text-vibrant-red text-center" role="alert">{feedback}</div>}
    </div>
  );
}