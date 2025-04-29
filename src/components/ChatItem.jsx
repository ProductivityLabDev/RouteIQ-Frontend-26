import React from 'react';

export const ChatItem = ({ name, logo, message, time, isHighlighted }) => (
    <div className={`flex items-center p-2 rounded-lg ${isHighlighted ? 'bg-[#F9E8E9]' : ''}`}>
        <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold" style={{ backgroundColor: logo.color }}>
            {logo.text}
        </div>
        <div className="ml-3 flex-grow">
            <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">{name}</span>
                <span className="text-xs text-gray-500">{time}</span>
            </div>
            <p className="text-sm text-gray-600 truncate">{message}</p>
        </div>
    </div>
);