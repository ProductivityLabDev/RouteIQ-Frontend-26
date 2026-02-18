import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { chatService } from "@/services/chatService";

const normalizeError = (error) => {
  const msg = error?.response?.data?.message;
  return Array.isArray(msg) ? msg.join(", ") : msg || "An error occurred";
};

export const fetchContacts = createAsyncThunk(
  "chat/fetchContacts",
  async (type, { rejectWithValue }) => {
    try {
      const res = await chatService.getContacts(type);
      return res.data || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (type, { rejectWithValue }) => {
    try {
      const res = await chatService.getConversations(type);
      return res.data || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async ({ conversationId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const res = await chatService.getMessages(conversationId, { page, limit });
      return { conversationId, messages: res.data || [] };
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, content, file }, { rejectWithValue }) => {
    try {
      const res = await chatService.sendMessage({ conversationId, content, file });
      return res.data;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createConversation = createAsyncThunk(
  "chat/createConversation",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await chatService.createConversation(payload);
      return res.data;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const markConversationRead = createAsyncThunk(
  "chat/markConversationRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      await chatService.markAsRead(conversationId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const fetchMonitoringConversations = createAsyncThunk(
  "chat/fetchMonitoringConversations",
  async (params, { rejectWithValue }) => {
    try {
      const { silent, ...apiParams } = params || {};
      const res = await chatService.getMonitoringConversations(apiParams);
      return { conversations: res.data || [], pagination: res.pagination, silent };
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const fetchMonitoringMessages = createAsyncThunk(
  "chat/fetchMonitoringMessages",
  async ({ conversationId, page = 1, limit = 50, beforeMessageId, append = false, silent = false }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (beforeMessageId) params.beforeMessageId = beforeMessageId;
      const res = await chatService.getMonitoringMessages(conversationId, params);
      return { conversationId, messages: res.data || [], pagination: res.pagination, append, silent };
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

const initialState = {
  contacts: [],
  conversations: [],
  activeConversationId: null,
  messages: {},
  monitoringConversations: [],
  monitoringMessages: {},
  activeMonitoringConversationId: null,
  monitoringPagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  monitoringMessagesPagination: {},
  monitoringFilters: {},
  typingUsers: {},
  loading: {
    contacts: false,
    conversations: false,
    messages: false,
    send: false,
    monitoringConversations: false,
    monitoringMessages: false,
  },
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    setActiveMonitoringConversation: (state, action) => {
      state.activeMonitoringConversationId = action.payload;
    },
    setMonitoringFilters: (state, action) => {
      state.monitoringFilters = action.payload;
    },
    resetMonitoringFilters: (state) => {
      state.monitoringFilters = {};
    },
    receiveMessage: (state, action) => {
      const msg = action.payload;
      const convId = msg.conversationId;

      // Update normal chat messages
      if (!state.messages[convId]) {
        state.messages[convId] = [];
      }
      const exists = state.messages[convId].some((m) => m.id === msg.id);
      if (!exists) {
        state.messages[convId].push(msg);
      }
      // Update last message in conversations list
      const conv = state.conversations.find((c) => c.id === convId);
      if (conv) {
        conv.lastMessage = msg;
        conv.updatedAt = msg.createdAt;
        if (convId !== state.activeConversationId) {
          conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
      }

      // Also update monitoring messages (live refresh)
      if (state.monitoringMessages[convId]) {
        const monExists = state.monitoringMessages[convId].some((m) => m.id === msg.id);
        if (!monExists) {
          state.monitoringMessages[convId].push(msg);
        }
      }
      // Update last message in monitoring conversations list
      const monConv = state.monitoringConversations.find((c) => c.id === convId);
      if (monConv) {
        monConv.lastMessage = msg;
        monConv.updatedAt = msg.createdAt;
      }
    },
    receiveMonitoringMessage: (state, action) => {
      const msg = action.payload;
      const convId = msg.conversationId;
      // Add to monitoring messages if conversation is loaded
      if (state.monitoringMessages[convId]) {
        const exists = state.monitoringMessages[convId].some((m) => m.id === msg.id);
        if (!exists) {
          state.monitoringMessages[convId].push(msg);
        }
      }
      // Update last message in monitoring conversations list
      const monConv = state.monitoringConversations.find((c) => c.id === convId);
      if (monConv) {
        monConv.lastMessage = msg;
        monConv.updatedAt = msg.createdAt;
      }
    },
    setUserTyping: (state, action) => {
      const { conversationId, userId, name } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      const exists = state.typingUsers[conversationId].some(
        (u) => u.userId === userId
      );
      if (!exists) {
        state.typingUsers[conversationId].push({ userId, name });
      }
    },
    clearUserTyping: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((u) => u.userId !== userId);
      }
    },
    clearChatState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchContacts
      .addCase(fetchContacts.pending, (state) => {
        state.loading.contacts = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading.contacts = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading.contacts = false;
        state.error = action.payload || "Failed to fetch contacts";
      })
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading.conversations = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error = action.payload || "Failed to fetch conversations";
      })
      // fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.loading.messages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading.messages = false;
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.error = action.payload || "Failed to fetch messages";
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.loading.send = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.send = false;
        const msg = action.payload;
        if (msg && msg.conversationId) {
          if (!state.messages[msg.conversationId]) {
            state.messages[msg.conversationId] = [];
          }
          const exists = state.messages[msg.conversationId].some(
            (m) => m.id === msg.id
          );
          if (!exists) {
            state.messages[msg.conversationId].push(msg);
          }
          // Update last message
          const conv = state.conversations.find(
            (c) => c.id === msg.conversationId
          );
          if (conv) {
            conv.lastMessage = msg;
            conv.updatedAt = msg.createdAt;
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.send = false;
        state.error = action.payload || "Failed to send message";
      })
      // createConversation
      .addCase(createConversation.fulfilled, (state, action) => {
        if (action.payload) {
          state.conversations.unshift(action.payload);
          state.activeConversationId = action.payload.id;
        }
      })
      // markConversationRead
      .addCase(markConversationRead.fulfilled, (state, action) => {
        const conv = state.conversations.find(
          (c) => c.id === action.payload
        );
        if (conv) {
          conv.unreadCount = 0;
        }
      })
      // fetchMonitoringConversations
      .addCase(fetchMonitoringConversations.pending, (state, action) => {
        const silent = action.meta?.arg?.silent;
        if (!silent) state.loading.monitoringConversations = true;
        state.error = null;
      })
      .addCase(fetchMonitoringConversations.fulfilled, (state, action) => {
        state.loading.monitoringConversations = false;
        const { conversations, pagination } = action.payload;
        state.monitoringConversations = conversations;
        if (pagination) {
          state.monitoringPagination = pagination;
        }
      })
      .addCase(fetchMonitoringConversations.rejected, (state, action) => {
        state.loading.monitoringConversations = false;
        const silent = action.meta?.arg?.silent;
        if (!silent) {
          state.error =
            action.payload || "Failed to fetch monitoring conversations";
        }
      })
      // fetchMonitoringMessages
      .addCase(fetchMonitoringMessages.pending, (state, action) => {
        const silent = action.meta?.arg?.silent;
        if (!silent) state.loading.monitoringMessages = true;
        state.error = null;
      })
      .addCase(fetchMonitoringMessages.fulfilled, (state, action) => {
        state.loading.monitoringMessages = false;
        const { conversationId, messages, pagination, append, silent } = action.payload;
        if (append && state.monitoringMessages[conversationId]) {
          // Prepend older messages, deduplicate
          const existingIds = new Set(state.monitoringMessages[conversationId].map((m) => m.id));
          const newMsgs = messages.filter((m) => !existingIds.has(m.id));
          state.monitoringMessages[conversationId] = [...newMsgs, ...state.monitoringMessages[conversationId]];
        } else if (silent && state.monitoringMessages[conversationId]?.length) {
          // Silent poll: merge new messages at end without replacing
          const existingIds = new Set(state.monitoringMessages[conversationId].map((m) => m.id));
          const newMsgs = messages.filter((m) => !existingIds.has(m.id));
          if (newMsgs.length) {
            state.monitoringMessages[conversationId].push(...newMsgs);
          }
        } else {
          state.monitoringMessages[conversationId] = messages;
        }
        // Store pagination metadata for this conversation
        const hasMore = pagination?.hasMore ?? (pagination ? pagination.page < pagination.totalPages : false);
        state.monitoringMessagesPagination[conversationId] = {
          ...(pagination || {}),
          hasMore,
        };
      })
      .addCase(fetchMonitoringMessages.rejected, (state, action) => {
        state.loading.monitoringMessages = false;
        const silent = action.meta?.arg?.silent;
        if (!silent) {
          state.error =
            action.payload || "Failed to fetch monitoring messages";
        }
      });
  },
});

export const {
  setActiveConversation,
  setActiveMonitoringConversation,
  setMonitoringFilters,
  resetMonitoringFilters,
  receiveMessage,
  receiveMonitoringMessage,
  setUserTyping,
  clearUserTyping,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
