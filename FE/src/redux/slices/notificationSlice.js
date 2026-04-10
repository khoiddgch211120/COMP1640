import { createSlice } from '@reduxjs/toolkit';

/* ─── Notification types from BE ─────────────────────────────
   "NEW_IDEA"     → QA_COORDINATOR receives when a new idea is posted in their dept
   "NEW_COMMENT"  → ACADEMIC/SUPPORT receives when a comment is posted on their idea
──────────────────────────────────────────────────────────── */

const MAX_NOTIFICATIONS = 50; // Keep at most 50 notifications in store

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    messages: [],      // list of notification objects
    unreadCount: 0,    // badge count
    isLoading: false,  // loading state
    error: null,       // error message
  },
  reducers: {
    addNotification: (state, action) => {
      // Prepend to list, keep at most MAX_NOTIFICATIONS
      state.messages = [action.payload, ...state.messages].slice(0, MAX_NOTIFICATIONS);
      state.unreadCount += 1;
    },
    markOneAsRead: (state, action) => {
      // action.payload = ideaId or index
      const idx = state.messages.findIndex(
        (m) => m.ideaId === action.payload && !m.isRead
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
    },
    removeNotification: (state, action) => {
      // Remove a single notification by id
      const idx = state.messages.findIndex((m) => m.id === action.payload);
      if (idx !== -1) {
        const removedNotif = state.messages[idx];
        state.messages.splice(idx, 1);
        // Decrease unreadCount if removed notification was unread
        if (!removedNotif.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
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