import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

/**
 * Initialize socket.io connection with JWT auth token.
 * Returns the connected socket instance.
 */
export function initSocket(token) {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    autoConnect: true,
  });

  return socket;
}

/**
 * Return existing socket (may be null if not initialized).
 */
export function getSocket() {
  return socket;
}

/**
 * Disconnect and clear socket.
 */
export function destroySocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
