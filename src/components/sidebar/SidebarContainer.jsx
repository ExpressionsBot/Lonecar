// SidebarContainer.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useChatStore from '@/store/chatStore';
import SidebarHeader from './SidebarHeader';
import SidebarChatList from './SidebarChatList';
import SidebarFooter from './SidebarFooter';
import SidebarNewChatModal from './SidebarNewChatModal';
import { handleDeleteChat, handleLogout } from '@/utils/sidebarHandlers';

const SidebarContainer = () => {
  const { chats, fetchChats } = useChatStore((state) => ({ 
    chats: state.chats,
    fetchChats: state.fetchChats
  }));
  const setCurrentChat = useChatStore((state) => state.setCurrentChat);
  const currentChat = useChatStore((state) => state.currentChat);
  const createChat = useChatStore((state) => state.createChat);

  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  const isMessageLoading = useChatStore((state) => state.isMessageLoading);

  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true);
      try {
        await fetchChats();
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast.error(`Failed to load chat sessions: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    loadChats();
  }, [fetchChats]);

  const handleOpenNewChatModal = () => setIsModalOpen(true);
  const handleCloseNewChatModal = () => setIsModalOpen(false);

  const handleCreateChat = async (newChatName) => {
    if (!newChatName || !newChatName.trim()) return;

    try {
      const chatData = await createChat(newChatName.trim());
      setCurrentChat(chatData.id);
      setIsModalOpen(false);
      // Optionally reset newChatName if you manage it here
    } catch (error) {
      console.error('Error creating chat:', error);
      // Handle error, e.g., show a toast notification
    }
  };

  return (
    <div className={`bg-navy text-light-gray flex flex-col h-full transition-all duration-300 ease-in-out border-r border-light-gray border-opacity-20 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-grow overflow-y-auto">
        <SidebarChatList 
          isLoading={isLoading}
          isCollapsed={isCollapsed}
          chats={chats}
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          handleDeleteChat={(chatId) => handleDeleteChat(chatId, fetchChats, setCurrentChat, currentChat)}
          isMessageLoading={isMessageLoading}
        />
      </div>
      <SidebarFooter 
        isCollapsed={isCollapsed}
        handleOpenNewChatModal={handleOpenNewChatModal}
        handleLogout={handleLogout}
      />
      <SidebarNewChatModal 
        isOpen={isModalOpen}
        onClose={handleCloseNewChatModal}
        newChatName={newChatName}
        setNewChatName={setNewChatName}
        handleCreateChat={handleCreateChat}
      />
    </div>
  );
}

export default SidebarContainer;