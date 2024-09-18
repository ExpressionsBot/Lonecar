import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const useChatStore = create((set, get) => ({
  currentChat: null,
  messages: [],
  chats: [],
  messageInput: '',
  userProgress: {},
  context: [],

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

  sendMessage: async (message, chatId, context, userProgress) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message, userId: session.user.id, chatId, context, userProgress }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        let errorMessage;
        try {
          const jsonError = JSON.parse(errorData);
          errorMessage = jsonError.message || jsonError.error || 'Unknown error';
        } catch {
          errorMessage = errorData;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      set((state) => ({
        messages: [...state.messages, { role: 'assistant', content: data.response }],
      }));
      return data;
    } catch (error) {
      console.error('Detailed error in sendMessage:', error);
      set({ error: error.message });
      throw error;
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
