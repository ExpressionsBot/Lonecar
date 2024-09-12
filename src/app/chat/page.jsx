"use client";

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
    setUserId
  } = useChatStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isAiResponding, setIsAiResponding] = useState(false);

  useEffect(() => {
    if (currentChat) {
      fetchMessages(currentChat);
    }
  }, [currentChat, fetchMessages]);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false);
        if (session.user && session.user.id) {
          setUserId(session.user.id);
          console.log('User ID set:', session.user.id);
        } else {
          console.error('Session user or user ID is undefined');
        }
      }
    }
  }, [session, loading, router, setUserId]);

  useEffect(() => {
    console.log('Current messages in ChatPage:', messages);
  }, [messages]);

  const handleSendMessage = useCallback(async (content) => {
    if (!currentChat) return;

    const userMessage = {
      content,
      sender: 'user',
      session_id: currentChat,
      created_at: new Date().toISOString()
    };

    try {
      setIsAiResponding(true);
      await sendMessage(userMessage);
      // No need to fetch messages here, as it's handled by the subscription
    } catch (error) {
      console.error('Error in message flow:', error);
      toast.error('Error sending message: ' + error.message);
    } finally {
      setIsAiResponding(false);
    }
  }, [currentChat, sendMessage]);

  // Add functions to update user progress and context
  const updateUserProgress = useCallback((newProgress) => {
    setUserProgress({ ...userProgress, ...newProgress });
  }, [userProgress, setUserProgress]);

  const updateContext = useCallback((newContext) => {
    setContext([...context, newContext]);
  }, [context, setContext]);

  const onChatDelete = useCallback((deletedChatId) => {
    useChatStore.getState().clearMessages();
    useChatStore.getState().fetchChats();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-navy">
      <Sidebar 
        setCurrentChat={setCurrentChat} 
        currentChat={currentChat} 
        onChatDelete={onChatDelete}
      />
      <div className="flex flex-col flex-grow overflow-hidden">
        <ChatHeader currentChat={currentChat} />
        <div className="flex-grow overflow-y-auto bg-navy">
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
            isAiResponding={isAiResponding} 
          />
        </div>
        <MessageInput onSendMessage={handleSendMessage} isAiResponding={isAiResponding} />
      </div>
    </div>
  );
}