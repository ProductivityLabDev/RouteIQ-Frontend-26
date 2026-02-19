import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationService } from "@/services/notificationService";

export const fetchMyNotifications = createAsyncThunk(
  "notifications/fetchMyNotifications",
  async ({ limit = 50, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const res = await notificationService.getMyNotifications({ limit, offset });
      return res.data || [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized = Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch notifications";
      return rejectWithValue(normalized);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.getUnreadCount();
      return Number(res.unreadCount || 0);
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized = Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch unread count";
      return rejectWithValue(normalized);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.markRead(notificationId);
      return Number(notificationId);
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized = Array.isArray(msg) ? msg.join(", ") : msg || "Failed to mark read";
      return rejectWithValue(normalized);
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllRead();
      return true;
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized = Array.isArray(msg) ? msg.join(", ") : msg || "Failed to mark all read";
      return rejectWithValue(normalized);
    }
  }
);

export const fetchRecipients = createAsyncThunk(
  "notifications/fetchRecipients",
  async (audience, { rejectWithValue }) => {
    try {
      const res = await notificationService.getRecipients(audience);
      return res.data || [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized = Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch recipients";
      return rejectWithValue(normalized);
    }
  }
);

export const fetchSentNotifications = createAsyncThunk(
  "notifications/fetchSentNotifications",
  async ({ limit = 50, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const res = await notificationService.getSent({ limit, offset });
      return res.data || [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized = Array.isArray(msg) ? msg.join(", ") : msg || "Failed to fetch sent notifications";
      return rejectWithValue(normalized);
    }
  }
);

export const sendNotification = createAsyncThunk(
  "notifications/sendNotification",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await notificationService.send(payload);
      return res.data;
    } catch (error) {
      const msg = error?.response?.data?.message;
      const normalized = Array.isArray(msg) ? msg.join(", ") : msg || "Failed to send notification";
      return rejectWithValue(normalized);
    }
  }
);

const initialState = {
  items: [],
  sentItems: [],
  recipients: [],
  unreadCount: 0,
  loading: {
    list: false,
    count: false,
    markRead: false,
    markAll: false,
    sent: false,
    send: false,
    recipients: false,
  },
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationsState: (state) => {
      state.items = [];
      state.sentItems = [];
      state.unreadCount = 0;
      state.loading = { list: false, count: false, markRead: false, markAll: false, sent: false, send: false };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading.list = false;
        state.items = action.payload || [];
        state.error = null;
        // derive unread if backend returns IsRead
        state.unreadCount = (state.items || []).reduce((acc, n) => {
          const isRead = n?.IsRead === 1 || n?.IsRead === true;
          return acc + (isRead ? 0 : 1);
        }, 0);
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.loading.list = false;
        state.items = [];
        state.error = action.payload || "Failed to fetch notifications";
      })
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loading.count = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading.count = false;
        state.unreadCount = Number(action.payload || 0);
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.loading.count = false;
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.loading.markRead = true;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading.markRead = false;
        const id = Number(action.payload);
        state.items = (state.items || []).map((n) => {
          const nid = Number(n?.NotificationId ?? n?.id);
          return nid === id ? { ...n, IsRead: 1 } : n;
        });
        state.unreadCount = Math.max(0, Number(state.unreadCount || 0) - 1);
      })
      .addCase(markNotificationRead.rejected, (state) => {
        state.loading.markRead = false;
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading.markAll = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.loading.markAll = false;
        state.items = (state.items || []).map((n) => ({ ...n, IsRead: 1 }));
        state.unreadCount = 0;
      })
      .addCase(markAllNotificationsRead.rejected, (state) => {
        state.loading.markAll = false;
      })
      .addCase(fetchRecipients.pending, (state) => {
        state.loading.recipients = true;
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.loading.recipients = false;
        state.recipients = action.payload || [];
      })
      .addCase(fetchRecipients.rejected, (state) => {
        state.loading.recipients = false;
        state.recipients = [];
      })
      .addCase(fetchSentNotifications.pending, (state) => {
        state.loading.sent = true;
        state.error = null;
      })
      .addCase(fetchSentNotifications.fulfilled, (state, action) => {
        state.loading.sent = false;
        state.sentItems = action.payload || [];
        state.error = null;
      })
      .addCase(fetchSentNotifications.rejected, (state, action) => {
        state.loading.sent = false;
        state.sentItems = [];
        state.error = action.payload || "Failed to fetch sent notifications";
      })
      .addCase(sendNotification.pending, (state) => {
        state.loading.send = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.loading.send = false;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading.send = false;
        state.error = action.payload || "Failed to send notification";
      });
  },
});

export const { clearNotificationsState } = notificationsSlice.actions;
export default notificationsSlice.reducer;

