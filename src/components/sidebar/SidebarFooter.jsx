// SidebarFooter.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import SidebarButton from './SidebarButton';

const SidebarFooter = ({ isCollapsed, handleOpenNewChatModal, handleLogout }) => {
  return (
    <div className="p-4 space-y-2">
      <SidebarButton
        onClick={handleOpenNewChatModal}
        icon={faPlus}
        text="New Chat"
        isCollapsed={isCollapsed}
        className="bg-vibrant-red hover:bg-red-600 text-white border border-white"
      />
      <SidebarButton
        onClick={handleLogout}
        icon={faSignOutAlt}
        text="Logout"
        isCollapsed={isCollapsed}
        className="bg-black hover:bg-gray-800 text-white border border-vibrant-red"
      />
    </div>
  );
};

export default SidebarFooter;