import React from 'react';

export function VendorFeedbackChatMessage({ isOwnMessage, message, avatarUrl, timestamp, venderfeedbackData }) {
    const imageSrc = venderfeedbackData || avatarUrl;

    return (
        <div className={`chat-message ${isOwnMessage ? 'flex justify-end' : 'flex'} mb-4`}>
            {!isOwnMessage && (
                imageSrc ? (
                    <img src={imageSrc} alt="Profile" className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
                ) : (
                    <div className="w-10 h-10 rounded-full mr-3 flex-shrink-0 bg-gray-200" />
                )
            )}
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isOwnMessage
                            ? 'bg-[#C01824] text-white rounded-br-none'
                            : 'bg-white text-[#202224] rounded-bl-none border border-[#ECECEC]'
                    }`}
                >
                    <p className="text-sm leading-6">{message}</p>
                    <div className={`mt-2 text-xs ${isOwnMessage ? 'text-white/80' : 'text-gray-500'}`}>
                        {timestamp}
                    </div>
                </div>
            </div>
        </div>
    );
}
