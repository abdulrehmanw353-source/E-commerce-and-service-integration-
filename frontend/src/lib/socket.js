import { io } from 'socket.io-client';

/**
 * Socket manager — supports both customer and admin connections.
 * Uses Vite's proxy for /socket.io, so we connect to same origin ('').
 */

let customerSocket = null;
let adminSocket = null;

/**
 * Initialize customer socket.io connection with JWT auth token.
 */
export function initSocket(token) {
  if (customerSocket?.connected) return customerSocket;

  // Disconnect any stale socket before creating a new one
  if (customerSocket) {
    customerSocket.disconnect();
  }

  customerSocket = io('', {
    path: '/socket.io',
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    autoConnect: true,
  });

  return customerSocket;
}

/**
 * Return existing customer socket (may be null if not initialized).
 */
export function getSocket() {
  return customerSocket;
}

/**
 * Disconnect and clear customer socket.
 */
export function destroySocket() {
  if (customerSocket) {
    customerSocket.disconnect();
    customerSocket = null;
  }
}

/**
 * Initialize admin socket.io connection with JWT auth token.
 * Separate from customer socket to prevent conflicts.
 */
export function initAdminSocket(token) {
  if (adminSocket?.connected) return adminSocket;

  if (adminSocket) {
    adminSocket.disconnect();
  }

  adminSocket = io('', {
    path: '/socket.io',
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    autoConnect: true,
  });

  return adminSocket;
}

/**
 * Return existing admin socket.
 */
export function getAdminSocket() {
  return adminSocket;
}

/**
 * Disconnect and clear admin socket.
 */
export function destroyAdminSocket() {
  if (adminSocket) {
    adminSocket.disconnect();
    adminSocket = null;
  }
}
