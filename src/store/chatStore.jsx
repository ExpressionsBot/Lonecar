import { create } from 'zustand';
import supabase from '@/utils/supabaseClient';

const useChatStore = create((set, get) => ({
  currentChat: null,
  messages: [],
  chats: [],
  messageInput: '',
  userProgress: {},
  context: [],

  setCurrentChat: (chatId) => set({ currentChat: chatId }),

  fetchMessages: async (chatId) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('session_id', chatId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      set({ messages: data || [] });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },

  fetchChats: async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      set({ chats: data || [] });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },

  sendMessage: async (message) => {
    const { currentChat, userProgress, context } = get();
    try {
      // Insert user message into Supabase
      const { data: newMessage, error: insertError } = await supabase
        .from('conversations')
        .insert({
          content: message.content,
          session_id: currentChat,
          sender: 'user',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Send message to API for processing
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.content,
          chatId: currentChat,
          context: context,
          userProgress: userProgress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error processing message');
      }

      const result = await response.json();

      // Insert AI response into Supabase
      await supabase.from('conversations').insert({
        content: result.message,
        session_id: currentChat,
        sender: 'assistant',
      });

      // Fetch updated messages
      await get().fetchMessages(currentChat);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  createChat: async (sessionName) => {
    try {
      // Verify authentication and get the user
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();

      if (sessionError) throw sessionError;
      if (!user) {
        console.error('User is not authenticated');
        return;
      }

      // Insert into chat_sessions
      const { data: chatData, error: chatError } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          session_name: sessionName,
        })
        .select()
        .single();

      if (chatError) {
        console.error('Chat creation error:', chatError);
        throw chatError;
      }

      // Update chats in the store
      const { chats } = get();
      set({ chats: [chatData, ...chats] });

      // Optionally set the new chat as current
      set({ currentChat: chatData.id });

      return chatData;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },
}));

export default useChatStore;
