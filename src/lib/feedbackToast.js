import React from "react";

const listeners = new Set();
const queue = [];
let activeNotification = null;
let notificationCounter = 0;

const normalizeMessage = (message) => {
  if (typeof message === "string") {
    return message;
  }

  if (message instanceof Error) {
    return message.message || "Something went wrong";
  }

  if (typeof message === "object" && message !== null) {
    if (typeof message.message === "string") {
      return message.message;
    }

    try {
      return JSON.stringify(message);
    } catch {
      return "Something went wrong";
    }
  }

  return String(message || "Something went wrong");
};

const emit = () => {
  const snapshot = activeNotification;
  listeners.forEach((listener) => listener(snapshot));
};

const shiftQueue = () => {
  activeNotification = queue.shift() || null;
  emit();
};

const enqueue = (type, message, options = {}) => {
  const notification = {
    id: `feedback-${Date.now()}-${notificationCounter += 1}`,
    type,
    message: normalizeMessage(message),
    duration:
      typeof options.duration === "number"
        ? options.duration
        : type === "error"
        ? 4500
        : 3200,
  };

  if (activeNotification) {
    queue.push(notification);
  } else {
    activeNotification = notification;
  }

  emit();
  return notification.id;
};

export const subscribeToFeedback = (listener) => {
  listeners.add(listener);
  listener(activeNotification);

  return () => {
    listeners.delete(listener);
  };
};

export const dismissFeedback = (id) => {
  if (!id) {
    activeNotification = null;
    queue.length = 0;
    emit();
    return;
  }

  if (activeNotification?.id === id) {
    shiftQueue();
    return;
  }

  const index = queue.findIndex((item) => item.id === id);
  if (index >= 0) {
    queue.splice(index, 1);
  }
};

const toast = (message, options) => enqueue("info", message, options);

toast.success = (message, options) => enqueue("success", message, options);
toast.error = (message, options) => enqueue("error", message, options);
toast.loading = (message, options) => enqueue("loading", message, options);
toast.dismiss = dismissFeedback;

export const Toaster = () => null;
export { toast };
export default toast;
