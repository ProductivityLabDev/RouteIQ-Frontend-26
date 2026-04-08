import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { ChatMessage } from '@/components/ChatMessage';
import { apiClient } from '@/configs/api';
import { chatService } from '@/services/chatService';

const tabNames = [
  "Report Issue",
  "Seek Personal Assistance",
  "Feedback On Improving Transportation",
  // Backend currently rejects these categories:
  // "Report Concerns",
  // "Foster Collaboration",
];

const pickConversationId = (payload) =>
  payload?.conversationId ??
  payload?.ConversationId ??
  payload?.data?.conversationId ??
  payload?.data?.ConversationId ??
  payload?.id ??
  null;

export function FeedbackSupport() {
  const [activeTab, setActiveTab] = useState(0);
  const [conversationIds, setConversationIds] = useState({});
  const [messagesByTab, setMessagesByTab] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [loadingConversation, setLoadingConversation] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const currentCategory = tabNames[activeTab];
  const currentConversationId = conversationIds[currentCategory] ?? null;
  const currentMessages = messagesByTab[currentCategory] ?? [];

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const currentIdentity = useMemo(() => {
    return {
      username: currentUser?.username || currentUser?.name || '',
      role: String(currentUser?.role || '').toUpperCase(),
    };
  }, [currentUser]);

  const loadMessages = async (conversationId, category) => {
    const res = await chatService.getMessages(conversationId, { page: 1, limit: 100 });
    setMessagesByTab((prev) => ({
      ...prev,
      [category]: Array.isArray(res?.data) ? res.data : [],
    }));
  };

  const ensureConversation = async (category) => {
    if (conversationIds[category]) {
      return conversationIds[category];
    }

    const response = await apiClient.post('/school/support/start', { category });
    const conversationId = pickConversationId(response?.data);

    if (!conversationId) {
      throw new Error('Conversation ID not returned from support start.');
    }

    setConversationIds((prev) => ({
      ...prev,
      [category]: conversationId,
    }));

    return conversationId;
  };

  useEffect(() => {
    let cancelled = false;

    const bootstrapSupport = async () => {
      setLoadingConversation(true);
      setError('');

      try {
        const conversationId = await ensureConversation(currentCategory);
        if (!cancelled) {
          await loadMessages(conversationId, currentCategory);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Failed to load support conversation.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingConversation(false);
        }
      }
    };

    bootstrapSupport();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, currentCategory]);

  useEffect(() => {
    if (!currentConversationId) return;
    const interval = setInterval(() => {
      loadMessages(currentConversationId, currentCategory).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [currentConversationId, currentCategory]);

  const isOwnMessage = (msg) => {
    const senderName = String(msg?.senderName ?? msg?.sender?.name ?? '').toLowerCase();
    const senderType = String(msg?.senderType ?? msg?.sender?.type ?? '').toUpperCase();
    return (
      (!!currentIdentity.username && senderName === String(currentIdentity.username).toLowerCase()) ||
      senderType === 'SCHOOL'
    );
  };

  const handleSend = async () => {
    if (!messageInput.trim() || !currentConversationId) return;

    setSending(true);
    setError('');

    try {
      await chatService.sendMessage({
        conversationId: currentConversationId,
        content: messageInput.trim(),
      });
      setMessageInput('');
      await loadMessages(currentConversationId, currentCategory);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to send message.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section>
      <h1 className="block antialiased tracking-normal text-[24px] md:text-[32px] font-bold leading-[1.3] my-6 text-inherit">
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
            {currentCategory}
          </h1>
          <hr />
          <div className="flex-1 p-2 lg:p-6 justify-between flex flex-col h-[700px]">
            <div id="messages" className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
              {loadingConversation ? (
                <div className="text-sm text-gray-400">Loading conversation...</div>
              ) : error ? (
                <div className="text-sm text-red-500">{error}</div>
              ) : currentMessages.length === 0 ? (
                <div className="text-sm text-gray-400">No messages yet. Start the conversation below.</div>
              ) : (
                currentMessages.map((msg, index) => (
                  <ChatMessage
                    key={msg?.id ?? `${currentCategory}-${index}`}
                    isOwnMessage={isOwnMessage(msg)}
                    message={msg}
                    showSenderName={!isOwnMessage(msg)}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t-2 border-gray-200 lg:px-4 pt-4 mb-2 sm:mb-0">
              <div className="relative flex md:flex-nowrap flex-wrap bg-white">
                <input
                  type="text"
                  placeholder="Write your message!"
                  className="w-full border border-gray-200 rounded-md focus:outline-none focus:placeholder-gray-400 text-gray-700 placeholder-gray-500 pl-3 md:pl-4 pr-28 py-2"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={loadingConversation || sending || !currentConversationId}
                />
                <div className="absolute right-0 items-center space-x-1 lg:space-x-3 inset-y-0 flex">
                  <Button
                    size='lg'
                    type="button"
                    className="inline-flex md:ml-3 items-center justify-center rounded-lg px-4 md:px-6 py-3 capitalize text-xs md:text-[16px] transition duration-500 ease-in-out text-white bg-[#C01824] hover:opacity-80 focus:outline-none"
                    onClick={handleSend}
                    disabled={loadingConversation || sending || !messageInput.trim() || !currentConversationId}
                  >
                    <span className="font-medium">{sending ? 'Sending...' : 'Send'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 transform rotate-45 ml-1">
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
  );
}

export default FeedbackSupport;
