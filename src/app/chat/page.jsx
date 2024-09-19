"use client";

import { subscribeToMessages } from '@/utils/realtimeService';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar/SidebarContainer';
import ChatHeader from '@/components/ChatHeader';
import ChatMessages from '@/components/ChatMessages';
import MessageInput from '@/components/MessageInput';
import useChatStore from '@/store/chatStore';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '@/utils/supabaseClient'; // Add this line

export default function ChatPage() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const { 
    messages, 
    fetchMessages, 
    currentChat, 
    setCurrentChat, 
    sendMessage, 
    userProgress, 
    setUserProgress, 
    context, 
    setContext,
    addMessage,
    initializeUser // Keep this one
  } = useChatStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAiResponding, setIsAiResponding] = useState(false);

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat);
      const unsubscribe = subscribeToMessages(currentChat, (newMessage) => {
        addMessage(newMessage); // Use addMessage from the store
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [currentChat, fetchMessages, addMessage]);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false);
        // Check if the user is authenticated with Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
            router.push('/login');
          }
        });
      }
    }
  }, [session, loading, router]);

  useEffect(() => {
    console.log('Current messages in ChatPage:', messages);
  }, [messages]);

  const handleSendMessage = useCallback(async (content) => {
    if (!currentChat || !session) return;
    const userMessage = {
      content,
      sender: 'user',
      session_id: currentChat,
      user_id: session.user.id,
      created_at: new Date().toISOString()
    };
    try {
      setIsAiResponding(true);
      // Insert the user message into Supabase
      const { data, error } = await supabase
        .from('conversations')
        .insert(userMessage)
        .select();
      if (error) throw error;
      // Add the message to the local state
      addMessage(data[0]);
      // Send the message to the AI
      await sendMessage(userMessage);
    } catch (error) {
      console.error('Error in message flow:', error);
      toast.error('Error sending message: ' + error.message);
    } finally {
      setIsAiResponding(false);
    }
  }, [currentChat, session, sendMessage, addMessage]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <div className="flex h-screen overflow-hidden bg-navy">
      <Sidebar
        setCurrentChat={setCurrentChat}
        currentChat={currentChat}
      />
      <div className="flex flex-col flex-grow overflow-hidden">
        <ChatHeader currentChat={currentChat} />
        <div className="flex-grow overflow-y-auto bg-navy">
          <ChatMessages
            currentChat={currentChat} // Pass currentChat as prop
            messages={messages}
            addMessage={addMessage} // Pass addMessage as prop
            isLoading={isLoading}
            isAiResponding={isAiResponding}
          />
        </div>
        <MessageInput
          onSendMessage={handleSendMessage}
          isAiResponding={isAiResponding}
          currentChat={currentChat}
          sendMessage={sendMessage}
          context={context}
          userProgress={userProgress}
        />
      </div>
    </div>
  );
}

