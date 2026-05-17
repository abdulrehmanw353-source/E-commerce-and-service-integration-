import { useEffect, useRef, useState, useCallback } from 'react';
import { initSocket, destroySocket, getSocket } from '../lib/socket';
import { useAuthStore } from '../store/authStore';

/**
 * useSocket — manages socket.io connection lifecycle.
 *
 * - Connects when user is authenticated (has accessToken)
 * - Automatically reconnects if token changes
 * - Cleans up on logout / unmount
 *
 * @returns { socket, connected }
 */
export function useSocket() {
  const accessToken = useAuthStore(s => s.accessToken);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!accessToken) {
      destroySocket();
      setConnected(false);
      return;
    }

    const s = initSocket(accessToken);
    socketRef.current = s;

    s.on('connect',    () => setConnected(true));
    s.on('disconnect', () => setConnected(false));
    s.on('connect_error', (err) => {
      console.warn('[socket] connect_error:', err.message);
      setConnected(false);
    });

    return () => {
      s.off('connect');
      s.off('disconnect');
      s.off('connect_error');
    };
  }, [accessToken]);

  return { socket: socketRef.current ?? getSocket(), connected };
}

/**
 * useConversation — manages a single chat conversation room.
 *
 * Joins the room, listens for new messages, handles typing indicators.
 * Khans NOT fetch history — use the REST API for that.
 */
export function useConversation(conversationId) {
  const { socket, connected } = useSocket();
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(null);

  // Join/leave room
  useEffect(() => {
    if (!socket || !conversationId || !connected) return;
    socket.emit('joinConversation', conversationId);

    const onNewMessage = (msg) => {
      setRealtimeMessages(prev => {
        // Deduplicate by _id
        if (prev.some(m => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onTyping    = ()       => { setIsTyping(true);  clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => setIsTyping(false), 2500); };
    const onStopped   = ()       => { setIsTyping(false); clearTimeout(typingTimer.current); };
    const onReadAck   = ()       => {};

    socket.on('newMessage',        onNewMessage);
    socket.on('userTyping',        onTyping);
    socket.on('userStoppedTyping', onStopped);
    socket.on('messagesRead',      onReadAck);

    return () => {
      socket.emit('leaveConversation', conversationId);
      socket.off('newMessage',        onNewMessage);
      socket.off('userTyping',        onTyping);
      socket.off('userStoppedTyping', onStopped);
      socket.off('messagesRead',      onReadAck);
      clearTimeout(typingTimer.current);
    };
  }, [socket, conversationId, connected]);

  const sendMessage = useCallback((content) => {
    if (!socket || !conversationId || !content.trim()) return;
    socket.emit('sendMessage', { conversationId, content: content.trim() });
    socket.emit('stopTyping', conversationId);
  }, [socket, conversationId]);

  const emitTyping = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit('typing', conversationId);
  }, [socket, conversationId]);

  const markRead = useCallback(() => {
    if (!socket || !conversationId) return;
    socket.emit('markRead', conversationId);
  }, [socket, conversationId]);

  return { realtimeMessages, setRealtimeMessages, isTyping, sendMessage, emitTyping, markRead, connected };
}
