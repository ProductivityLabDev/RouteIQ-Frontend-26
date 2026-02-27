import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

const EMPTY_ARRAY = []; // stable reference — avoids new [] on every render
import {
  addfileicon,
  darksearchicon,
  sendicon,
} from "@/assets";
import { Button } from "@material-tailwind/react";
import ChatItem from "@/components/ChatItem";
import ChatMessage from "@/components/ChatMessage";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationRead,
  setActiveConversation,
  fetchMonitoringConversations,
  fetchMonitoringMessages,
  setActiveMonitoringConversation,
} from "@/redux/slices/chatSlice";
import { socketService } from "@/services/socketService";

const ChatPanel = ({ participantTypeFilter, isMonitoring = false, monitoringFilters = {} }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [convPage, setConvPage] = useState(1);
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Stable key for object dependency — avoids infinite re-renders from new object refs
  const monitoringFiltersKey = JSON.stringify(monitoringFilters);
  const monitoringFiltersRef = useRef(monitoringFilters);
  monitoringFiltersRef.current = monitoringFilters;

  const currentUser = useSelector((state) => state.user?.user);
  const currentUserId = currentUser?.id || currentUser?.UserId;

  const conversations = useSelector((state) =>
    isMonitoring ? state.chat.monitoringConversations : state.chat.conversations
  );
  const activeId = useSelector((state) =>
    isMonitoring
      ? state.chat.activeMonitoringConversationId
      : state.chat.activeConversationId
  );
  const allMessages = useSelector((state) =>
    isMonitoring ? state.chat.monitoringMessages : state.chat.messages
  );
  const messages = activeId ? allMessages[activeId] || [] : [];
  const typingUsers = useSelector(
    (state) => state.chat.typingUsers?.[activeId] ?? EMPTY_ARRAY,
    shallowEqual
  );
  const loading = useSelector((state) => state.chat.loading);
  const monitoringPagination = useSelector(
    (state) => state.chat.monitoringPagination
  );
  const monitoringMsgPagination = useSelector(
    (state) => state.chat.monitoringMessagesPagination
  );

  const hasOlderMessages = isMonitoring && activeId && monitoringMsgPagination[activeId]?.hasMore;
  const convTotalPages = monitoringPagination?.totalPages || 1;

  // Fetch conversations on mount / when filters or page change
  useEffect(() => {
    if (isMonitoring) {
      const params = { ...monitoringFiltersRef.current, page: convPage, limit: 20 };
      if (participantTypeFilter) params.type = participantTypeFilter;
      dispatch(fetchMonitoringConversations(params));
    } else {
      dispatch(fetchConversations(participantTypeFilter));
    }
  }, [dispatch, participantTypeFilter, isMonitoring, monitoringFiltersKey, convPage]);

  // Reset page to 1 when filters change — only relevant in monitoring mode
  useEffect(() => {
    if (!isMonitoring) return;
    setConvPage(1);
  }, [monitoringFiltersKey, isMonitoring]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeId) return;
    if (isMonitoring) {
      dispatch(fetchMonitoringMessages({ conversationId: activeId }));
    } else {
      dispatch(fetchMessages({ conversationId: activeId }));
      dispatch(markConversationRead(activeId));
    }
  }, [activeId, dispatch, isMonitoring]);

  // Silent polling for monitoring (backend has no WebSocket for monitoring)
  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(() => {
      const params = { ...monitoringFiltersRef.current, page: convPage, limit: 20, silent: true };
      if (participantTypeFilter) params.type = participantTypeFilter;
      dispatch(fetchMonitoringConversations(params));
      if (activeId) {
        dispatch(fetchMonitoringMessages({ conversationId: activeId, silent: true }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isMonitoring, activeId, dispatch, monitoringFiltersKey, convPage, participantTypeFilter]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConversation = (convId) => {
    if (isMonitoring) {
      dispatch(setActiveMonitoringConversation(convId));
    } else {
      dispatch(setActiveConversation(convId));
    }
  };

  const handleLoadOlder = () => {
    if (!activeId || !messages.length) return;
    const oldestMsg = messages[0];
    dispatch(
      fetchMonitoringMessages({
        conversationId: activeId,
        beforeMessageId: oldestMsg.id,
        append: true,
      })
    );
  };

  const handleSend = () => {
    const text = messageText.trim();
    if (!text || !activeId) return;
    dispatch(sendMessage({ conversationId: activeId, content: text }));
    setMessageText("");
    socketService.stopTyping(activeId);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    if (!activeId) return;
    socketService.startTyping(activeId);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(activeId);
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeId) return;
    dispatch(sendMessage({ conversationId: activeId, file }));
    e.target.value = "";
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const name =
      conv.name ||
      conv.participants?.find((p) => p.id !== currentUserId)?.name ||
      "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-row w-full gap-5 h-[75vh]">
      {/* Left sidebar - Conversation list */}
      <div className="bg-white w-full max-w-[300px] rounded-[12px] border shadow-sm pt-2 capitalize md:block hidden flex-shrink-0">
        <div className="relative flex items-center">
          <img
            src={darksearchicon}
            alt=""
            className="absolute left-3 h-4 w-4"
          />
          <input
            className="bg-[#D2D2D2]/30 w-full pl-10 p-3 outline-none border-0"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="pt-2 overflow-y-auto" style={{ maxHeight: isMonitoring && convTotalPages > 1 ? "calc(75vh - 100px)" : "calc(75vh - 60px)" }}>
          {loading.conversations || loading.monitoringConversations ? (
            <p className="text-center text-gray-500 text-sm py-4">
              Loading...
            </p>
          ) : filteredConversations.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">
              No conversations
            </p>
          ) : (
            filteredConversations.map((conv) => (
              <ChatItem
                key={conv.id}
                conversation={conv}
                isActive={conv.id === activeId}
                onClick={() => handleSelectConversation(conv.id)}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
        {/* Conversation pagination for monitoring */}
        {isMonitoring && convTotalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-1.5 border-t border-gray-200 text-xs">
            <button
              onClick={() => setConvPage((p) => Math.max(1, p - 1))}
              disabled={convPage <= 1 || loading.monitoringConversations}
              className="px-2 py-1 rounded text-[#C01824] hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-gray-500">
              {convPage}/{convTotalPages}
            </span>
            <button
              onClick={() => setConvPage((p) => Math.min(convTotalPages, p + 1))}
              disabled={convPage >= convTotalPages || loading.monitoringConversations}
              className="px-2 py-1 rounded text-[#C01824] hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Right panel - Messages */}
      <div className="bg-white w-full rounded-[12px] border shadow-sm flex flex-col">
        {!activeId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            <div
              className="flex-1 flex flex-col space-y-2 p-4 overflow-y-auto"
            >
              {/* Load older messages button for monitoring */}
              {hasOlderMessages && !loading.monitoringMessages && (
                <button
                  onClick={handleLoadOlder}
                  className="self-center text-sm text-[#C01824] hover:underline py-1 px-3 rounded bg-red-50 hover:bg-red-100 transition-colors mb-2"
                >
                  Load older messages
                </button>
              )}
              <div ref={messagesTopRef} />
              {loading.messages || loading.monitoringMessages ? (
                <p className="text-center text-gray-500 text-sm py-4">
                  Loading messages...
                </p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">
                  No messages yet
                </p>
              ) : (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isOwnMessage={(msg.senderId || msg.sender?.id) === currentUserId}
                    showSenderName={isMonitoring}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="px-4 pb-1 text-xs text-gray-500 italic">
                {typingUsers.map((u) => u.name).join(", ")}{" "}
                {typingUsers.length === 1 ? "is" : "are"} typing...
              </div>
            )}

            {/* Input bar - hidden in monitoring mode */}
            {!isMonitoring && (
              <div className="border-t-2 border-gray-200 px-4 pt-4 pb-3">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-200 focus:outline-none flex-shrink-0"
                  >
                    <img
                      src={addfileicon}
                      alt=""
                      className="md:h-[26px] md:w-[26px]"
                    />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <input
                    type="text"
                    placeholder="Message"
                    className="w-full focus:outline-none bg-[#F0F4F8] rounded-lg focus:placeholder-gray-400 text-[#102A43] placeholder-gray-500 pl-4 py-2"
                    value={messageText}
                    onChange={(e) => {
                      setMessageText(e.target.value);
                      handleTyping();
                    }}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    size="lg"
                    onClick={handleSend}
                    disabled={loading.send}
                    className="inline-flex ml-3 items-center justify-center rounded-md px-7 py-2 transition duration-500 ease-in-out text-white bg-[#C01824] hover:opacity-80 focus:outline-none flex-shrink-0"
                  >
                    <span className="font-normal capitalize text-xs md:text-[12px]">
                      Send
                    </span>
                    <img
                      src={sendicon}
                      alt=""
                      className="h-[14px] w-[12px] ml-1"
                    />
                  </Button>
                </div>
              </div>
            )}

            {/* Read-only indicator for monitoring */}
            {isMonitoring && (
              <div className="border-t border-gray-200 px-4 py-3 text-center text-sm text-gray-500 bg-gray-50 rounded-b-[12px]">
                Read-only monitoring mode
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
