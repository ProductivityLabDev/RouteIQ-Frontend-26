import React from "react";
import { format, isToday, isYesterday } from "date-fns";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
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
      className={`flex items-center p-3 cursor-pointer rounded-lg transition-all ${
        isActive ? "bg-[#F9E8E9]" : "hover:bg-gray-50"
      }`}
    >
      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold bg-[#C01824] text-sm">
        {getInitials(displayName)}
      </div>
      <div className="ml-3 flex-grow min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm text-[#202224] truncate">
            {displayName}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{time}</span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <p className="text-sm text-gray-600 truncate">
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
