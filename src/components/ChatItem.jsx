import React from "react";
import { format, isToday, isYesterday } from "date-fns";
import { parseAppDate } from "@/utils/dateTime";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = parseAppDate(dateStr);
  if (!date) return "";
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MM/dd/yyyy");
}

function getDisplayName(conversation, currentUserId) {
  if (conversation.type === "GROUP") return conversation.name || "Group";
  // Backend DIRECT: participant (singular) or participants (array)
  if (conversation.participant) return conversation.participant.name || "Unknown";
  const other = conversation.participants?.find(
    (p) => p.id !== currentUserId
  );
  return other?.name || "Unknown";
}

function getConversationMeta(conversation, currentUserId) {
  if (conversation.type !== "GROUP") {
    const participantType =
      conversation.participant?.type ||
      conversation.participants?.find((p) => p.id !== currentUserId)?.type ||
      "";
    return participantType ? `Direct chat - ${participantType}` : "Direct chat";
  }

  const participantNames = (conversation.participants || [])
    .filter((participant) => participant.id !== currentUserId)
    .map((participant) => participant.name)
    .filter(Boolean);

  if (participantNames.length === 0) return "Group chat";
  if (participantNames.length <= 2) return `Group chat - ${participantNames.join(", ")}`;
  return `Group chat - ${participantNames.slice(0, 2).join(", ")} +${participantNames.length - 2}`;
}

function getInitials(name) {
  return name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
}

export const ChatItem = ({ conversation, isActive, onClick, currentUserId }) => {
  const displayName = getDisplayName(conversation, currentUserId);
  const conversationMeta = getConversationMeta(conversation, currentUserId);
  const lastMsg = conversation.lastMessage;
  // Backend may send lastMessage as string and lastMessageAt for time
  const lastContent = typeof lastMsg === "string" ? lastMsg : lastMsg?.content;
  const time = formatTime(
    conversation.lastMessageAt || lastMsg?.createdAt || conversation.updatedAt
  );
  const unread = conversation.unreadCount || 0;

  return (
    <div
      onClick={onClick}
      className={`flex items-start rounded-xl border p-3 cursor-pointer transition-all ${
        isActive
          ? "border-[#F3C7CB] bg-[#FFF4F5] shadow-sm"
          : "border-transparent hover:border-[#F1E5E6] hover:bg-[#FCFAFA]"
      }`}
    >
      <div className="mt-0.5 h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center bg-[#C01824] text-sm font-bold text-white">
        {getInitials(displayName)}
      </div>
      <div className="ml-3 flex-grow min-w-0">
        <div className="flex justify-between items-center">
          <div className="min-w-0 pr-2">
            <span className="font-semibold text-sm text-[#202224] truncate block">
              {displayName}
            </span>
            <span className="text-[11px] text-gray-500 truncate block">
              {conversationMeta}
            </span>
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{time}</span>
        </div>
        <div className="mt-1 flex justify-between items-start">
          <p className="truncate pr-2 text-sm leading-5 text-gray-600">
            {lastContent || "No messages yet"}
          </p>
          {unread > 0 && (
            <span className="bg-[#C01824] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
