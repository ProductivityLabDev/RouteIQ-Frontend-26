import React from 'react';

export function VendorFeedbackChatMessage({ isOwnMessage, message, avatarUrl, timestamp, venderfeedbackData }) {
    console.log("venderfeedbackData ==>", venderfeedbackData)
    return (
        <div className={`chat-message ${isOwnMessage ? 'flex justify-end' : 'flex'} mb-4`}>
            {!isOwnMessage && (
                <img src={venderfeedbackData} alt="Profile" className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />
            )}
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className={`px-4 py-3 rounded-2xl ${isOwnMessage
                    ? 'bg-[#C01824] text-white rounded-br-none'
                    : 'bg-[#F5F5F5] text-[#202224] rounded-bl-none'
                    }`}>
                    <div className='flex flex-row items-end content-center justify-center'>
                        <p className="text-sm">{message}</p>
                        <div className='flex flex-row items-center'>
                            <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
                            {isOwnMessage && (
                                <div className="flex flex-col items-end ml-2 mt-2">
                                    <span className="text-gray-400 text-lg mb-1">⋮</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}