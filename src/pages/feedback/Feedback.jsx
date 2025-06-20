import React, { useState } from 'react';
import {
  ChatDriver1, ChatDriver2, ChatDriver3, ChatDriver4, ChatDriver5,
  darksearchicon, feedbackChatUser1, feedbackChatUser2, feedbackChatUser3,
  feedbackChatUser4, feedbackChatUser5, fileuploadicon, imguploadicon,
  Parent1, Parent2, Parent3, Parent4, Parent5
} from '@/assets';
import { initialMessages } from '@/data';
import MainLayout from '@/layouts/SchoolLayout';
import { Button, Tabs, TabsBody } from '@material-tailwind/react';
import { IoMdThumbsUp, IoMdThumbsDown } from "react-icons/io";
import { VendorFeedbackChatMessage } from '@/components/VendorFeedbackMessage';

const Feedback = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [venderfeedbackData, setVenderfeedbackData] = useState(null);

  const tabNames = ["School Feedback", "Driver Feedback", "Parent Feedback"];
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
      message: "It is a long established fact that a reader will be distracted by the readable content...",
      avatarUrl: "https://via.placeholder.com/40",
      timestamp: "6:30 pm"
    },
    {
      isOwnMessage: true,
      message: "There are many variations of passages of Lorem Ipsum available...",
      avatarUrl: "",
      timestamp: "6:34 pm"
    },
    {
      isOwnMessage: false,
      message: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution...",
      avatarUrl: "https://via.placeholder.com/40",
      timestamp: "6:38 pm"
    }
  ];

  const conditionTab =
    activeTab === 0 ? chats :
    activeTab === 1 ? chatsDriver :
    chatsParent;

  const handleData = (logo) => setVenderfeedbackData(logo);

  return (
    <MainLayout>
      <section className='w-full min-h-screen'>
        <h1 className="text-[24px] md:text-[32px] font-semibold leading-[1.3] my-6">Feedback</h1>

        <div className='flex flex-col xl:flex-row xl:space-x-5 w-full h-[calc(100vh-150px)]'>

          {/* Sidebar Tabs */}
          <div className='bg-white w-full xl:max-w-[200px] rounded-xl space-y-1 border shadow-sm p-4 xl:h-full mb-4 xl:mb-0'>
            {tabNames.map((name, index) => (
              <Button
                key={index}
                className={`w-full text-left font-semibold text-sm md:text-[16px] capitalize pl-4 shadow-none rounded-[4px] transition-all
                  ${activeTab === index ? 'bg-[#F9E8E9] text-[#C01824]' : 'bg-transparent text-black hover:bg-[#C01824] hover:text-white'}`}
                onClick={() => setActiveTab(index)}
              >
                {name}
              </Button>
            ))}
          </div>

          {/* Chat List Panel */}
          <div className='bg-white w-full xl:max-w-[280px] rounded-xl border shadow-sm xl:h-full mb-4 xl:mb-0 overflow-hidden'>
            <div className="p-4 border-b border-[#D2D2D2]">
              <div className="flex justify-between items-center text-[14px] font-medium">
                <div>Total Feedback: <span className="font-normal">254</span></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[#6F6F6F]"><IoMdThumbsUp size={20}/> <span>55</span></div>
                  <div className="flex items-center gap-1 text-[#6F6F6F]"><IoMdThumbsDown size={20}/> <span>12</span></div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab}>
              <div className="flex items-center px-4 py-2">
                <input
                  className="flex-grow p-2 bg-white outline-none placeholder-[#000] border border-gray-300 rounded"
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img src={darksearchicon} alt="Search" className="ml-2 h-4 w-4" />
              </div>

              <TabsBody className='overflow-y-auto max-h-[500px] xl:max-h-full px-2'>
                {conditionTab.map(({ name, logo, message, time, count }, index) => (
                  <Button
                    key={index}
                    variant='text'
                    className={`flex items-center gap-3 py-3 w-full text-left hover:bg-[#F9E8E9] transition-all rounded-none
                      ${index === 0 ? 'bg-[#F9E8E9]' : ''}`}
                    onClick={() => handleData(logo)}
                  >
                    <img src={logo} alt={name} className="rounded-full  h-[42px]" />
                    <div className='flex-1 text-sm'>
                      <div className='flex justify-between'>
                        <span className="font-bold text-[14px]">{name}</span>
                        <span className="text-[#627D98] text-xs w-[70%]">{time}</span>
                      </div>
                      <div className='flex justify-between items-center'>
                        <p className="text-[#334E68] text-[10px] truncate w-[50%] pr-2">{message}</p>
                        {count > 0 && (
                          <div className='bg-[#C52707] text-white text-xs rounded-full px-2 py-0.5'>
                            {count}
                          </div>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </TabsBody>
            </Tabs>
          </div>

          {/* Chat Panel */}
          <div className='bg-white w-full rounded-xl border shadow-sm flex flex-col xl:h-full'>
            <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
              <div id="messages" className="flex-1 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <VendorFeedbackChatMessage key={index} {...msg} venderfeedbackData={venderfeedbackData} />
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Write your message!"
                    className="flex-grow p-2 rounded border outline-none"
                  />
                  <img src={fileuploadicon} alt="Upload File" className="h-6 w-6 cursor-pointer" />
                  <img src={imguploadicon} alt="Upload Image" className="h-6 w-6 cursor-pointer" />
                  <Button size="lg" className="bg-[#C01824] text-white px-4 py-2 flex items-center gap-1 hover:opacity-90">
                    <span>Send</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rotate-45">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </MainLayout>
  );
};

export default Feedback;
