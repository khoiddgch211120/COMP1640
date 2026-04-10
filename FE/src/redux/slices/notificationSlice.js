import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

/* ─── Notification types from BE ─────────────────────────────
   "NEW_IDEA"     → QA_COORDINATOR receives when a new idea is posted in their dept
   "NEW_COMMENT"  → ACADEMIC/SUPPORT receives when a comment is posted on their idea
──────────────────────────────────────────────────────────── */

const MAX_NOTIFICATIONS = 50; // Keep at most 50 notifications in store

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const data = await notificationService.getNotifications(page, size);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const data = await notificationService.getUnreadCount();
      return data.unreadCount;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markOneAsReadAsync = createAsyncThunk(
  'notifications/markOneAsReadAsync',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

export const markAllAsReadAsync = createAsyncThunk(
  'notifications/markAllAsReadAsync',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    messages: [],      // list of notification objects
    unreadCount: 0,    // badge count
    isLoading: false,  // loading state
    error: null,       // error message
    totalPages: 0,
    currentPage: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      // Prepend to list (real-time from WebSocket), keep at most MAX_NOTIFICATIONS
      state.messages = [action.payload, ...state.messages].slice(0, MAX_NOTIFICATIONS);
      state.unreadCount += 1;
    },
    markOneAsRead: (state, action) => {
      // action.payload = notificationId
      const idx = state.messages.findIndex(
        (m) => m.notificationId === action.payload && !m.isRead
      );
      if (idx !== -1) {
        state.messages[idx].isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.messages = state.messages.map((m) => ({ ...m, isRead: true }));
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.messages = [];
      state.unreadCount = 0;
      state.totalPages = 0;
      state.currentPage = 0;
    },
    removeNotification: (state, action) => {
      const idx = state.messages.findIndex((m) => m.notificationId === action.payload);
      if (idx !== -1) {
        const removedNotif = state.messages[idx];
        state.messages.splice(idx, 1);
        if (!removedNotif.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        const { content, totalPages, number } = action.payload;
        if (number === 0) {
          state.messages = content;
        } else {
          // Append for pagination
          state.messages = [...state.messages, ...content];
        }
        state.totalPages = totalPages;
        state.currentPage = number;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // fetchUnreadCount
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // markOneAsReadAsync
      .addCase(markOneAsReadAsync.fulfilled, (state, action) => {
        const idx = state.messages.findIndex((m) => m.notificationId === action.payload);
        if (idx !== -1 && !state.messages[idx].isRead) {
          state.messages[idx].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // markAllAsReadAsync
      .addCase(markAllAsReadAsync.fulfilled, (state) => {
        state.messages = state.messages.map((m) => ({ ...m, isRead: true }));
        state.unreadCount = 0;
      });
  },
});

export const {
  addNotification,
  markOneAsRead,
  markAllAsRead,
  clearNotifications,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;