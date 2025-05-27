import React, { useState } from 'react'
import { ChatDriver1, ChatDriver2, ChatDriver3, ChatDriver4, ChatDriver5, darksearchicon, feedbackChatUser1, feedbackChatUser2, feedbackChatUser3, feedbackChatUser4, feedbackChatUser5, fileuploadicon, imguploadicon, Parent1, Parent2, Parent3, Parent4, Parent5 } from '@/assets';
import { ChatMessage } from '@/components/ChatMessage';
import { initialMessages } from '@/data';
import MainLayout from '@/layouts/SchoolLayout'
import { Button, Input, Tabs, TabsBody } from '@material-tailwind/react';
import { FaSearch } from 'react-icons/fa';
import { ChatItem } from '@/components/ChatItem';
import { VendorFeedbackChatMessage } from '@/components/VendorFeedbackMessage';
import { IoMdThumbsUp } from "react-icons/io";
import { IoMdThumbsDown } from "react-icons/io";



const Feedback = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [tabMessages, setTabMessages] = useState(initialMessages);
    const [searchTerm, setSearchTerm] = useState('');
    const [venderfeedbackData, setVenderfeedbackData] = useState(null);
    const tabNames = [
        "School Feedback",
        "Driver Feedback",
        "Parent Feedback",
    ];
    const chats = [
        { name: "NYU STERN", logo: feedbackChatUser5, message: "Thanks, I can't wait to see you tomorrow for coffee!", time: "12:01pm", count: 0 },
        { name: "Taft Public School", logo: feedbackChatUser4, message: "No", time: "11:22pm", count: 0 },
        { name: "Berkeley Haas", logo: feedbackChatUser3, message: "Have you seen Jane's new dog???????", time: "11:22pm", count: 1 },
        { name: "DC Virgo Middle", logo: feedbackChatUser2, message: "I know! Where is the time going?!", time: "11:22pm", count: 0 },
        { name: "Hoggard High", logo: feedbackChatUser1, message: "sounds good", time: "11:22pm", count: 0 },
    ];
    const chatsDriver = [
        { name: "Sarah Johnson", logo: ChatDriver1, message: "Thanks, I can't wait to see you tomorrow for coffee!", time: "12:01pm", count: 0 },
        { name: "Angel Lubin", logo: ChatDriver2, message: "No", time: "11:22pm", count: 0 },
        { name: "Kaiya Levin", logo: ChatDriver3, message: "Have you seen Jane's new dog???????", time: "11:22pm", count: 1 },
        { name: "Phillip Aminoff", logo: ChatDriver4, message: "I know! Where is the time going?!", time: "11:22pm", count: 0 },
        { name: "Haylie Schleifer", logo: ChatDriver5, message: "sounds good", time: "11:22pm", count: 0 },
    ];
    const chatsParent = [
        { name: "Jerome Bell", logo: Parent1, message: "Thanks, I can't wait to see you tomorrow for coffee!", time: "12:01pm", count: 0 },
        { name: "Cameron Williamson", logo: Parent2, message: "No", time: "11:22pm", count: 0 },
        { name: "Robert Fox", logo: Parent3, message: "Have you seen Jane's new dog???????", time: "11:22pm", count: 1 },
        { name: "Darrell Steward", logo: Parent4, message: "I know! Where is the time going?!", time: "11:22pm", count: 0 },
        { name: "Devon Lane", logo: Parent5, message: "sounds good", time: "11:22pm", count: 0 },
    ];
    const messages = [
        {
            isOwnMessage: false,
            message: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
            avatarUrl: "https://via.placeholder.com/40",
            timestamp: "6:30 pm"
        },
        {
            isOwnMessage: true,
            message: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour,",
            avatarUrl: "",
            timestamp: "6:34 pm"
        },
        {
            isOwnMessage: false,
            message: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default.Contrary to popular belief, Lorem Ipsum is not simply random text is the model text for your company.",
            avatarUrl: "https://via.placeholder.com/40",
            timestamp: "6:38 pm"
        }
    ];
    const conditionTab =
        activeTab === 0
            ? chats
            : activeTab === 1
                ? chatsDriver
                : activeTab === 2
                    ? chatsParent
                    : chats;
    const handleData = (logo) => {
        setVenderfeedbackData(logo)
    }
    return (
        <MainLayout>
            <section className='w-full h-full'>
                <h1 className="block antialiased tracking-normal text-[24px] md:text-[32px] font-semibold leading-[1.3] my-6 text-inherit">
                    Feedback
                </h1>
                <div className='flex md:space-x-5 md:flex-row flex-col h-full'>
                    <div className='bg-white w-full max-w-[300px] rounded-xl space-y-1 border shadow-sm p-2 lg:p-7 h-[90%] capitalize md:mb-0 mb-4'>
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
                    <div className='bg-white w-full max-w-[300px] rounded-xl space-y-1 h-[90%] border shadow-sm capitalize md:mb-0 mb-4'>
                        <div className="space-y-2 overflow-y-auto max-h-[600px]">
                            <div className=" border-b border-[#D2D2D2]  rounded-t-lg p-3 max-w-md">
                            <div className="flex justify-between items-center text-[14] font-normal text-[#000000]">
                                <div className="font-medium">
                                Total Feedback: <span className="font-normal text-[#000000]">254</span>
                                </div>
                                <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <IoMdThumbsUp size={20} className="text-[#6F6F6F]"/>
                                    <span>55</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <IoMdThumbsDown size={20} className="text-[#6F6F6F]"/>
                                    <span>12</span>
                                </div>
                                </div>
                            </div>
                            </div>
                            <Tabs value={activeTab}>
                                <div className=" flex flex-row bg-[#fff] items-center self-center justify-center">
                                    <input
                                        className="bg-[#ffff] w-[87%]  p-3 outline-none border-0 placeholder-[#000]"
                                        type="search"
                                        placeholder="Search"
                                    />
                                    <img src={darksearchicon} alt='' className="left-3 h-4 w-4" />
                                </div>
                                <TabsBody className='pt-2'>
                                    {conditionTab.map(({ name, logo, message, time, count }, index) => (
                                        <div key={index}>
                                            <Button
                                                variant='gradient'
                                                className={`flex items-center gap-3 py-3 pl-4 w-full bg-none shadow-none rounded-none hover:bg-[#F9E8E9] group transition-all ${index === 0 ? 'bg-[#F9E8E9]' : ''
                                                    }`}
                                                onClick={() => handleData(logo)}
                                            >
                                                <img src={logo} alt={name} className="rounded-full w-[42px] h-[42px]" />
                                                <div className='text-start text-[#141516] w-full'>
                                                    <div className='flex justify-between text-[#141516]'>
                                                        <h6 className="font-bold text-[13px] capitalize">{name}</h6>
                                                        <span className="text-[#627D98] text-[12px] text-end">{time}</span>
                                                    </div>
                                                    <div className='flex justify-between w-full'>
                                                        <p className="font-medium pt-1 text-[#334E68] text-[13px] capitalize">{message}</p>
                                                        {count === 1 &&
                                                            <div className='rounded-[12px] bg-[#C52707] justify-center items-center self-center' style={{ minWidth: 16, height: 17 }}>
                                                                <p className='text-[#fff] text-[9px] text-center'>{count}</p>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                    ))}
                                </TabsBody>
                            </Tabs>
                        </div>
                    </div>
                    <div className='bg-white w-full rounded-xl border shadow-sm h-[90%]'>
                        <div className="flex-1 p-2 lg:p-6 justify-between flex flex-col h-[100%]">
                            <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                                {messages.map((msg, index) => (
                                    <VendorFeedbackChatMessage key={index} {...msg} venderfeedbackData={venderfeedbackData} />
                                ))}
                            </div>
                            <div className="border-t-2 border-gray-200 lg:px-4 pt-4 mb-2 sm:mb-0 ">
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
        </MainLayout>
    )
}

export default Feedback
