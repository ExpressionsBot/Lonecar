// sidebarHandlers.jsx
import supabase from '@/utils/supabaseClient';
import { toast } from 'react-toastify';
import useChatStore from '@/store/chatStore';

export const handleCreateChat = async (
  newChatName,
  chats,
  setCurrentChat,
  setIsModalOpen,
  setNewChatName
) => {
  if (!newChatName || !newChatName.trim()) return;

  try {
    // Verify authentication and get the user
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();

    if (sessionError) throw sessionError;
    if (!user) {
      console.error('User is not authenticated');
      toast.error('Please log in to create a chat session.');
      return;
    }

    // Prepare insert data with the correct user_id
    const insertData = {
      user_id: user.id,
      session_name: newChatName.trim(),
    };

    // Insert into chat_sessions
    const { data: chatData, error: chatError } = await supabase
      .from('chat_sessions')
      .insert(insertData)
      .select()
      .single();

    if (chatError) {
      console.error('Chat creation error:', chatError);
      toast.error('Error adding chat session: ' + chatError.message);
    } else if (chatData) {
      useChatStore.getState().addChat(chatData);
      setCurrentChat(chatData.id);
      toast.success('New chat session added successfully');
      setNewChatName('');
      setIsModalOpen(false);
    } else {
      console.error('No chat data returned');
      toast.error('Error creating chat: No data returned');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred. Please try again.');
  }
};

export const handleDeleteChat = async (chatId, fetchChats, setCurrentChat, currentChat, onChatDelete) => {
  try {
    // Attempt to delete the chat
    const { error, data } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', chatId)
      .select();

    if (error) {
      console.error('Error deleting chat session:', error);
      toast.error('Error deleting chat session: ' + error.message);
      return;
    }

    // Check if the chat was actually deleted
    if (data && data.length > 0) {
      await fetchChats(); // Fetch updated chats after deleting one
      if (currentChat === chatId) {
        setCurrentChat(null); // Reset current chat if it was deleted
        onChatDelete(chatId); // Clear the messages for the deleted chat
      }
      toast.success('Chat session deleted successfully');
    } else {
      console.error('Chat not found or already deleted');
      toast.warning('Chat not found or already deleted');
    }
  } catch (error) {
    console.error('Unexpected error during chat deletion:', error);
    toast.error('An unexpected error occurred while deleting the chat. Please try again.');
  }
};

export const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out: ' + error.message);
    } else {
      window.location.href = '/'; // Redirect to home page
      toast.success('Logged out successfully');
    }
  } catch (error) {
    console.error('Unexpected error during logout:', error);
    toast.error('An unexpected error occurred while logging out. Please try again.');
  }
};