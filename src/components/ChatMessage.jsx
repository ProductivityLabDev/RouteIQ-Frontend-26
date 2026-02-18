import React from "react";
import { format } from "date-fns";

export function ChatMessage({ message, isOwnMessage, showSenderName }) {
  // Backend may send sender: { id, type, name, avatar } instead of senderName
  const senderName = message.senderName ?? message.sender?.name ?? "";
  const time = message.createdAt
    ? format(new Date(message.createdAt), "h:mm a")
    : "";

  // Backend uses attachmentUrl + messageType; legacy uses fileUrl + fileType
  const fileUrl = message.attachmentUrl || message.fileUrl;
  const isImage =
    message.messageType === "IMAGE" ||
    (message.fileType && message.fileType.startsWith("image/")) ||
    false;
  const hasFile = !!fileUrl;

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`relative max-w-[70%] px-4 py-3 rounded-2xl ${
          isOwnMessage
            ? "bg-[#C01824] text-white rounded-br-none"
            : "bg-[#F9E8E9] text-[#102A43] rounded-bl-none"
        }`}
      >
        {showSenderName && !isOwnMessage && (
          <p className="text-xs font-semibold mb-1 opacity-80">
            {senderName}
          </p>
        )}

        {message.content && (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}

        {hasFile && (
          <div className="mt-2">
            {isImage ? (
              <img
                src={fileUrl}
                alt="attachment"
                className="max-w-full rounded-lg max-h-48 object-cover"
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm underline ${
                  isOwnMessage ? "text-white" : "text-[#C01824]"
                }`}
              >
                Download attachment
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-end mt-1">
          <span
            className={`text-[11px] ${
              isOwnMessage ? "text-white/70" : "text-gray-500"
            }`}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
