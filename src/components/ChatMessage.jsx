import React from 'react';

export function ChatMessage({ isOwnMessage, message, avatarUrl }) {
    return (
        <div className={`chat-message ${isOwnMessage ? 'justify-end' : ''}`}>
            <div className={`flex items-end ${isOwnMessage ? 'justify-end' : ''}`}>
                <div className={`flex flex-col space-y-2 text-xs md:text-[14px] max-w-sm mx-2 ${isOwnMessage ? 'order-2 items-end' : 'order-2 items-end'}`}>
                    {message.map((msg, index) => (
                        <div key={index}>
                            <span className={`px-4 py-2 rounded-lg inline-block ${isOwnMessage ? 'rounded-br-none bg-[#C01824] text-white' : 'rounded-bl-none bg-[#F5F5F5] text-[#202224]'}`}>
                                {msg}
                            </span>
                        </div>
                    ))}
                </div>
                <img src={avatarUrl} alt="Profile" className={`w-[25px] md:w-[40px] h-[25px] md:h-[40px] rounded-full ${isOwnMessage ? 'order-2' : 'order-1'}`} />
            </div>
        </div>
    );
};