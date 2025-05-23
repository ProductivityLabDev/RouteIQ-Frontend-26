import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export function ChatMessage({ isOwnMessage, message, avatarUrl, time}) {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isOwnMessage && (
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2 self-end"
        />
      )}
      <div
        className={`
          relative max-w-[70%] px-4 py-3 rounded-2xl
          ${isOwnMessage ? 'bg-[#C01824] text-white rounded-br-none' : 'bg-gray-100 text-black rounded-bl-none'}
        `}
      >
        {message.map((line, index) => (
          <p key={index} className="text-sm leading-relaxed">{line}</p>
        ))}

        <div className="flex items-center justify-end space-x-1 mt-2">
          <span className={`text-[12px] ${isOwnMessage ? 'text-white-500' : 'text-gray-500'}`}>
            {time}
          </span>
          <BsThreeDotsVertical size={20} className={isOwnMessage ? 'text-gray-200' : 'text-gray-500'} />
        </div>
      </div>

      {isOwnMessage && (
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full ml-2 self-end"
        />
      )}
    </div>
    );
};