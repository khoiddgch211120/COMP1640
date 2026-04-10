let client = null;
let isConnected = false;
let reconnectTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/ws/notifications';

/**
 * Get JWT token from localStorage
 */
const getAuthToken = () => {
  try {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const { token } = JSON.parse(savedAuth);
      return token;
    }
  } catch (error) {
    console.error('❌ Error getting token:', error);
  }
  return null;
};

/**
 * Connect to STOMP WebSocket
 * @param {string} userId - User ID
 * @param {function} onMessageReceived - Callback when notification received
 * @param {function} onConnect - Callback on successful connection
 * @param {function} onError - Callback on error
 */
export const connectWebSocket = async (userId, onMessageReceived, onConnect, onError) => {
  try {
    // Already connected, skip
    if (isConnected && client?.active) {
      console.log('✓ WebSocket already connected');
      return;
    }

    // Import stompjs
    const { Client } = await import('@stomp/stompjs');

    // Get JWT token for request headers
    const token = getAuthToken();

    // Create STOMP client
    client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        userId: userId,
        'X-User-ID': userId,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      onConnect: (frame) => {
        console.log('✓ Connected to WebSocket:', frame);
        isConnected = true;
        reconnectAttempts = 0; // Reset attempts on successful connection

        // Clear reconnect timeout if any
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }

        // Subscribe to user-specific notifications
        client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('📬 Notification received:', notification);
            if (onMessageReceived) {
              onMessageReceived(notification);
            }
          } catch (error) {
            console.error('❌ Error parsing notification:', error);
          }
        });

        // Call connection callback
        if (onConnect) {
          onConnect();
        }
      },

      onError: (error) => {
        console.error('❌ WebSocket error:', error);
        isConnected = false;

        if (onError) {
          onError(error);
        }

        // Auto reconnect with retry limit
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && !reconnectTimeout) {
          reconnectAttempts++;
          const delay = RECONNECT_DELAY * reconnectAttempts; // Exponential backoff
          console.log(`🔄 Cố gắng reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) sau ${delay}ms`);
          reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            connectWebSocket(userId, onMessageReceived, onConnect, onError);
          }, delay);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error('❌ Max reconnect attempts exceeded');
        }
      },

      onStompError: (frame) => {
        console.error('❌ Broker error:', frame.body);
        if (onError) {
          onError(frame);
        }
      },

      onDisconnect: () => {
        console.log('⚠️ WebSocket disconnected');
        isConnected = false;
      },

      reconnectDelay: 0, // Disable built-in reconnect, using custom logic instead
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log('STOMP:', str); // Uncomment to debug
      },
    });

    // Activate connection
    client.activate();
    console.log('�\udce1 Connecting to WebSocket:', WS_URL);
  } catch (error) {
    console.error('❌ Error initializing WebSocket:', error);
    if (onError) {
      onError(error);
    }
  }
};

/**
 * Disconnect WebSocket
 */
export const disconnectWebSocket = () => {
  if (client && client.active) {
    client.deactivate();
    isConnected = false;
    reconnectAttempts = 0; // Reset attempts on disconnect
    console.log('✓ WebSocket disconnected');
  }

  // Clear reconnect timeout if any
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
};

/**
 * Check connection status
 * @returns {boolean}
 */
export const isWebSocketConnected = () => isConnected;

/**
 * Send notification via WebSocket
 * @param {string} destination - Target destination
 * @param {object} body - Notification content
 * @param {object} headers - Headers (optional)
 */
export const sendNotification = (destination, body, headers = {}) => {
  if (!client || !client.active) {
    console.error('❌ WebSocket not connected');
    return;
  }

  try {
    client.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
    console.log('✓ Notification sent:', destination);
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
};

export default {
  connectWebSocket,
  disconnectWebSocket,
  isWebSocketConnected,
  sendNotification,
};
