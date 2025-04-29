import React, { useState } from 'react';
import { Button } from '@material-tailwind/react';
import { fileuploadicon, imguploadicon } from '@/assets';
import { ChatMessage } from '@/components/ChatMessage';
import { initialMessages } from '@/data';

export function FeedbackSupport() {
    const [activeTab, setActiveTab] = useState(0);

    const [tabMessages, setTabMessages] = useState(initialMessages);

    const tabNames = [
        "Report Issue",
        "Report Concerns",
        "Seek Personal Assistance",
        "Foster Collaboration",
        "Feedback on Improving Transportation"
    ];

    return (
        <section>
            <h1 className="block antialiased tracking-normal text-[24px] md:text-[32px] font-semibold leading-[1.3] my-6 text-inherit">
                Feedback & Support
            </h1>
            <div className='flex md:space-x-5 md:flex-row flex-col h-full'>
                <div className='bg-white w-full max-w-[300px] rounded-xl space-y-1 border shadow-sm p-2 lg:p-7 capitalize md:mb-0 mb-4'>
                    {tabNames.map((name, index) => (
                        <Button
                            key={index}
                            className={`font-semibold text-sm md:text-[16px] capitalize ${activeTab === index ? 'bg-[#F9E8E9] text-[#C01824]' : 'bg-transparent text-black hover:bg-[#C01824] hover:text-white'} w-full text-start pl-4 shadow-none rounded-[4px] transition-all`}
                            onClick={() => setActiveTab(index)}
                        >
                            {name}
                        </Button>
                    ))}
                </div>
                <div className='bg-white w-full rounded-xl border shadow-sm'>
                    <h1 className="block antialiased tracking-normal text-[16px] md:text-[21px] font-bold leading-[1.3] pl-7 my-4 md:my-6 text-inherit">
                        {tabNames[activeTab]}
                    </h1>
                    <hr />
                    <div className="flex-1 p-2 lg:p-6 justify-between flex flex-col h-[700px]">
                        <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                            {tabMessages[activeTab].map((msg, index) => (
                                <ChatMessage
                                    key={index}
                                    isOwnMessage={msg.isOwnMessage}
                                    message={msg.message}
                                    avatarUrl={msg.avatarUrl}
                                />
                            ))}
                        </div>
                        <div className="border-t-2 border-gray-200 lg:px-4 pt-4 mb-2 sm:mb-0">
                            <div className="relative flex md:flex-nowrap flex-wrap bg-black">
                                <input type="text" placeholder="Write your message!" className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-500 pl-2 md:pl-6 py-2" />
                                <div className="absolute right-0 items-center space-x-1 lg:space-x-3 inset-y-0">
                                    <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                        <img src={fileuploadicon} alt="not found" />
                                    </button>
                                    <button type="button" className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                        <img src={imguploadicon} alt="not found" />
                                    </button>
                                    <Button size='lg' type="submit" className="inline-flex md:ml-3 items-center justify-center rounded-lg px-4 md:px-6 py-3 capitalize text-xs md:text-[16px] transition duration-500 ease-in-out text-white bg-[#C01824] hover:opacity-80 focus:outline-none">
                                        <span className="font-medium">Send</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transform rotate-45">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                        </svg>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FeedbackSupport;
