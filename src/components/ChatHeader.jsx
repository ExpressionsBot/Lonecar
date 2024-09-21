"use client"; // Indicates that this file is a client-side module

import React from 'react'; // Import the useState hook
import Image from 'next/image'; // Import the Image component from Next.js

// Define the ChatHeader component
export default function ChatHeader({ currentChat }) {
  return (
    <header className="relative bg-navy text-light-gray p-0 shadow-md flex items-center justify-between flex-wrap border-b border-light-gray border-opacity-20" role="banner">
      <div className="flex items-center relative">
        <Image
          src="/6446aa0f3ea6fc51c7c3cd24_Lonestar Solar Services Logo-p-1600.png"
          alt="Lonestar Solar Services Logo"
          width={200}
          height={100}
          className="mr-2 relative z-16"
        />
        {/* Glowing effect */}
        <div
          className="absolute bottom left-0 w-52 h-10 bg-vibrant-red filter blur-lg z-90 animate-pulse"
          style={{ 
            opacity: -0.8,
            animationDuration: '10s'
          }}
          aria-hidden="true"
        ></div>
      </div>
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        {/* Add any additional header items here */}
      </div>
    </header>
  );
}