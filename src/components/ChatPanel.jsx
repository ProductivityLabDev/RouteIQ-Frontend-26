import React, { useEffect, useRef, useState, useCallback } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { parseAppDate } from "@/utils/dateTime";

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

const ChatPanel = ({
  participantTypeFilter,
  isMonitoring = false,
  monitoringFilters = {},
  autoSelectFirst = false,
  starterMessage = "",
  prefillTrigger = 0,
}) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [convPage, setConvPage] = useState(1);
  const messagesEndRef = useRef(null);
  const messagesTopRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

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
  const activeConvRef = useRef(activeId);
  useEffect(() => {
    activeConvRef.current = activeId;
  }, [activeId]);
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

  // Keep active monitoring conversation valid when list/filters/page changes
  useEffect(() => {
    if (!isMonitoring) return;
    if (!activeId) return;
    const exists = conversations.some((c) => c.id === activeId);
    if (!exists) {
      dispatch(setActiveMonitoringConversation(null));
    }
  }, [isMonitoring, conversations, activeId, dispatch]);

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
      const currentActiveId = activeConvRef.current;
      if (currentActiveId) {
        dispatch(fetchMonitoringMessages({ conversationId: currentActiveId, silent: true }));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isMonitoring, dispatch, monitoringFiltersKey, convPage, participantTypeFilter]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!showAttachmentMenu) return;

    const handleOutsideClick = (event) => {
      if (!attachmentMenuRef.current?.contains(event.target)) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showAttachmentMenu]);

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
    setShowAttachmentMenu(false);
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
  const activeConversation = conversations.find((conv) => conv.id === activeId) || null;
  const activeParticipants = (activeConversation?.participants || [])
    .filter((participant) => participant.id !== currentUserId)
    .map((participant) => participant.name)
    .filter(Boolean);
  const activeConversationTitle =
    activeConversation?.name ||
    activeConversation?.participant?.name ||
    activeParticipants[0] ||
    "Conversation";
  const activeConversationUpdatedAt =
    activeConversation?.lastMessageAt ||
    activeConversation?.lastMessage?.createdAt ||
    activeConversation?.updatedAt ||
    "";
  const conversationCountLabel = `${filteredConversations.length} conversation${filteredConversations.length === 1 ? "" : "s"}`;
  const getMonitoringMessageSide = useCallback((message) => {
    const senderType = String(message?.senderType || message?.sender?.type || "").toUpperCase();
    if (["GUARDIAN", "PARENT"].includes(senderType)) return false;
    if (["DRIVER", "VENDOR", "SCHOOL", "ADMIN", "INSTITUTE"].includes(senderType)) return true;
    return false;
  }, []);
  const formatConversationTimestamp = useCallback((value) => {
    if (!value) return "No recent activity";
    const date = parseAppDate(value);
    if (!date) return String(value);
    if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
    if (isYesterday(date)) return `Yesterday, ${format(date, "h:mm a")}`;
    return format(date, "MMM d, yyyy - h:mm a");
  }, []);

  // Optionally auto-select first conversation (used by quick actions like "Chat with Bus Team")
  useEffect(() => {
    if (!autoSelectFirst || filteredConversations.length === 0) return;
    const activeExistsInList = filteredConversations.some((c) => c.id === activeId);
    if (!activeId || !activeExistsInList) {
      const firstId = filteredConversations[0]?.id;
      if (firstId) handleSelectConversation(firstId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSelectFirst, filteredConversations, activeId]);

  // Optional starter draft for quick chat actions
  useEffect(() => {
    if (isMonitoring) return;
    if (!starterMessage) return;
    setMessageText(starterMessage);
  }, [prefillTrigger, starterMessage, isMonitoring]);

  return (
    <div className="flex w-full gap-4 h-[76vh] rounded-[16px] border border-[#E8E1D6] bg-[#FCFBF8] p-3">
      {/* Left sidebar - Conversation list */}
      <div className="hidden w-full max-w-[370px] flex-shrink-0 rounded-[14px] border border-[#E8E1D6] bg-white shadow-sm md:flex md:flex-col">
        <div className="border-b border-[#EFE7DB] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7B59]">
                Monitor Queue
              </p>
              <p className="mt-1 text-sm font-semibold text-[#202224]">{conversationCountLabel}</p>
            </div>
            {isMonitoring && (
              <span className="rounded-full bg-[#FDE8EA] px-2.5 py-1 text-[11px] font-semibold text-[#C01824]">
                Read Only
              </span>
            )}
          </div>
        </div>
        <div className="relative flex items-center px-3 pt-3">
          <img
            src={darksearchicon}
            alt=""
            className="absolute left-6 h-4 w-4 text-[#9CA3AF]"
          />
          <input
            className="w-full rounded-xl border border-[#E8E1D6] bg-[#FAF7F7] py-3 pl-10 pr-3 outline-none transition-colors focus:border-[#C01824]"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="px-3 pt-3 overflow-y-auto" style={{ maxHeight: isMonitoring && convTotalPages > 1 ? "calc(76vh - 150px)" : "calc(76vh - 110px)" }}>
          {loading.conversations || loading.monitoringConversations ? (
            <p className="text-center text-gray-500 text-sm py-4">
              Loading...
            </p>
          ) : filteredConversations.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-4">
              No conversations
            </p>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conv) => (
                <ChatItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeId}
                  onClick={() => handleSelectConversation(conv.id)}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
        {/* Conversation pagination for monitoring */}
        {isMonitoring && convTotalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#EFE7DB] px-3 py-2 text-xs">
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
      <div className="flex min-w-0 flex-1 rounded-[14px] border border-[#E8E1D6] bg-white shadow-sm">
        {!activeId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to inspect the monitored thread
          </div>
        ) : (
          <>
            <div className="flex min-w-0 flex-1">
              <div className="flex min-w-0 flex-1 flex-col">
                {isMonitoring && activeConversation && (
                  <div className="border-b border-[#EFE7DB] bg-[#FCFAF6] px-5 py-4 rounded-tl-[14px]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-bold text-[#202224] truncate">
                            {activeConversationTitle}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              activeConversation.type === "GROUP"
                                ? "bg-[#FFF1D6] text-[#B45309] border border-[#F6C56B]"
                                : "bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]"
                            }`}
                          >
                            {activeConversation.type === "GROUP" ? "Group Chat" : "Direct Chat"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {activeConversation.type === "GROUP" && activeParticipants.length > 0
                            ? `Participants: ${activeParticipants.join(", ")}`
                            : "Open a thread from the queue to inspect monitored messages."}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A7B59]">
                          Last Activity
                        </p>
                        <p className="mt-1 text-xs font-medium text-[#4B5563]">
                          {formatConversationTimestamp(activeConversationUpdatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="flex-1 space-y-3 overflow-y-auto bg-[#FFFEFD] px-4 py-4"
                >
              {/* Load older messages button for monitoring */}
              {hasOlderMessages && !loading.monitoringMessages && (
                <div className="flex justify-center pb-1">
                  <button
                    onClick={handleLoadOlder}
                    className="inline-flex items-center rounded-full border border-[#F3C7CB] bg-[#FFF4F5] px-4 py-2 text-sm font-semibold text-[#C01824] shadow-sm transition-colors hover:bg-[#FDE8EA]"
                  >
                    Load older messages
                  </button>
                </div>
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
                    isOwnMessage={
                      isMonitoring
                        ? getMonitoringMessageSide(msg)
                        : (msg.senderId || msg.sender?.id) === currentUserId
                    }
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
                      <div className="relative" ref={attachmentMenuRef}>
                        <button
                          type="button"
                          onClick={() => setShowAttachmentMenu((prev) => !prev)}
                          className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-200 focus:outline-none flex-shrink-0"
                        >
                          <img
                            src={addfileicon}
                            alt=""
                            className="md:h-[26px] md:w-[26px]"
                          />
                        </button>
                        {showAttachmentMenu && (
                          <div className="absolute bottom-12 left-0 z-20 min-w-[170px] overflow-hidden rounded-xl border border-[#E8E1D6] bg-white shadow-lg">
                            <button
                              type="button"
                              onClick={() => imageInputRef.current?.click()}
                              className="block w-full px-4 py-3 text-left text-sm font-medium text-[#202224] transition hover:bg-[#FFF4F5]"
                            >
                              Upload photo
                            </button>
                            <button
                              type="button"
                              onClick={() => docInputRef.current?.click()}
                              className="block w-full border-t border-[#F2ECE2] px-4 py-3 text-left text-sm font-medium text-[#202224] transition hover:bg-[#FFF4F5]"
                            >
                              Upload document
                            </button>
                          </div>
                        )}
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        <input
                          ref={docInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>
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
                  <div className="rounded-bl-[14px] border-t border-[#EFE7DB] bg-[#FAF7F2] px-4 py-3 text-center text-sm text-gray-500">
                    Read-only monitoring mode
                  </div>
                )}
              </div>

              {isMonitoring && (
                <aside className="hidden w-full max-w-[240px] flex-shrink-0 border-l border-[#EFE7DB] bg-[#FCFAF6] p-4 lg:block rounded-r-[14px]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9A7B59]">
                    Conversation Details
                  </p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                        Name
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#202224] break-words">
                        {activeConversationTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                        Type
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#374151]">
                        {activeConversation?.type === "GROUP" ? "Group chat" : "Direct chat"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                        Participants
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#374151] break-words">
                        {activeParticipants.length > 0 ? activeParticipants.join(", ") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                        Messages Loaded
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#374151]">
                        {messages.length}
                      </p>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
