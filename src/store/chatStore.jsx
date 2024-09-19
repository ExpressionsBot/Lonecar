import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const useChatStore = create((set, get) => ({
  currentChat: null,
  messages: [],
  chats: [],
  messageInput: '',
  userProgress: {},
  context: [],
  currentUserId: null, // Add this line

  initializeUser: async () => {
    // Fetch the current user from Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return;
    }

    if (user) {
      set({ currentUserId: user.id });
    }
  },

  setCurrentChat: (chatId) => set({ currentChat: chatId }),

  // Add the addMessage function here
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

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

  sendMessage: async (messageText, chatId, context, userProgress) => {
    const userId = get().currentUserId;

    if (!userId) {
      console.error('User ID is not set');
      return;
    }

    const userMessage = {
      id: uuidv4(),
      content: messageText,
      sender: 'user',
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          chatId,
          userId,
          context,
          userProgress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from API:', errorData);
        return;
      }

      const result = await response.json();
      if (result.success) {
        set((state) => ({
          messages: [...state.messages, userMessage],
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  },

  // Helper function to extract error message from HTML
  extractErrorFromHtml: (htmlContent) => {
    // This is a simple implementation. You might need to adjust it based on the actual HTML structure.
    const match = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (match) {
      return match[1].replace(/<[^>]*>/g, '').trim();
    }
    return null;
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

  subscribeToMessages: (chatId) => {
    const subscription = supabase
      .channel(`public:conversations:session_id=eq.${chatId}`)
      .on('INSERT', (payload) => {
        const newMessage = payload.new;
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  clearPendingResponse: (chatId) => {
    // Implement any logic needed to clear pending responses
    console.log(`Clearing pending response for chat ${chatId}`);
  },

  setMessageInput: (input) => set({ messageInput: input }),
}));

export default useChatStore;
