let client = null;
let isConnected = false;
let reconnectTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const WS_URL = API_BASE_URL.replace(/^http/, 'ws') + '/ws/notifications';

/**
 * Lấy JWT token từ localStorage
 */
const getAuthToken = () => {
  try {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const { token } = JSON.parse(savedAuth);
      return token;
    }
  } catch (error) {
    console.error('❌ Lỗi lấy token:', error);
  }
  return null;
};

/**
 * Kết nối WebSocket STOMP
 * @param {string} userId - ID người dùng
 * @param {function} onMessageReceived - Callback khi nhận thông báo
 * @param {function} onConnect - Callback khi kết nối thành công
 * @param {function} onError - Callback khi có lỗi
 */
export const connectWebSocket = async (userId, onMessageReceived, onConnect, onError) => {
  try {
    // Nếu đã kết nối, bỏ qua
    if (isConnected && client?.active) {
      console.log('✓ WebSocket đã kết nối');
      return;
    }

    // Import stompjs
    const { Client } = await import('@stomp/stompjs');

    // Lấy JWT token để gửi trong headers
    const token = getAuthToken();

    // Tạo client STOMP
    client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        userId: userId,
        'X-User-ID': userId,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      onConnect: (frame) => {
        console.log('✓ Đã kết nối đến WebSocket:', frame);
        isConnected = true;
        reconnectAttempts = 0; // Reset attempts khi kết nối thành công

        // Xóa timeout reconnect nếu có
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }

        // Subscribe đến user-specific notifications
        client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('📬 Nhận thông báo:', notification);
            if (onMessageReceived) {
              onMessageReceived(notification);
            }
          } catch (error) {
            console.error('❌ Lỗi parse thông báo:', error);
          }
        });

        // Gọi callback kết nối
        if (onConnect) {
          onConnect();
        }
      },

      onError: (error) => {
        console.error('❌ Lỗi WebSocket:', error);
        isConnected = false;

        if (onError) {
          onError(error);
        }

        // Tự động reconnect với giới hạn số lần thử
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && !reconnectTimeout) {
          reconnectAttempts++;
          const delay = RECONNECT_DELAY * reconnectAttempts; // Exponential backoff
          console.log(`🔄 Cố gắng reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) sau ${delay}ms`);
          reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            connectWebSocket(userId, onMessageReceived, onConnect, onError);
          }, delay);
        } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
          console.error('❌ Đã vượt quá số lần reconnect tối đa');
        }
      },

      onStompError: (frame) => {
        console.error('❌ Lỗi Broker:', frame.body);
        if (onError) {
          onError(frame);
        }
      },

      onDisconnect: () => {
        console.log('⚠️ WebSocket đã disconnect');
        isConnected = false;
      },

      reconnectDelay: RECONNECT_DELAY,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        // console.log('STOMP:', str); // Uncomment để debug
      },
    });

    // Kích hoạt kết nối
    client.activate();
    console.log('📡 Đang kết nối đến WebSocket:', WS_URL);
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo WebSocket:', error);
    if (onError) {
      onError(error);
    }
  }
};

/**
 * Ngắt kết nối WebSocket
 */
export const disconnectWebSocket = () => {
  if (client && client.active) {
    client.deactivate();
    isConnected = false;
    reconnectAttempts = 0; // Reset attempts khi ngắt kết nối
    console.log('✓ WebSocket đã ngắt kết nối');
  }

  // Xóa timeout reconnect nếu có
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
};

/**
 * Kiểm tra trạng thái kết nối
 * @returns {boolean}
 */
export const isWebSocketConnected = () => isConnected;

/**
 * Gửi thông báo qua WebSocket
 * @param {string} destination - Đường dẫn đích
 * @param {object} body - Nội dung thông báo
 * @param {object} headers - Headers (optional)
 */
export const sendNotification = (destination, body, headers = {}) => {
  if (!client || !client.active) {
    console.error('❌ WebSocket chưa kết nối');
    return;
  }

  try {
    client.publish({
      destination,
      body: JSON.stringify(body),
      headers,
    });
    console.log('✓ Thông báo đã gửi:', destination);
  } catch (error) {
    console.error('❌ Lỗi gửi thông báo:', error);
  }
};

export default {
  connectWebSocket,
  disconnectWebSocket,
  isWebSocketConnected,
  sendNotification,
};
