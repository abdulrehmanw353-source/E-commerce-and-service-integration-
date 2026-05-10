import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Send, Minimize2, MessageCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import api from '../../lib/axios';
import { useConversation } from '../../hooks/useSocket';
import ChatMessage from './ChatMessage';

// ─── REST API calls ───────────────────────────────────────────
const startOrGetConversation = () =>
  api.post('/chat/conversations').then(r => r.data.data ?? r.data);
const fetchMessages = (id) =>
  api.get(`/chat/conversations/${id}/messages`).then(r => r.data.data ?? r.data);
const sendRestMessage = (id, content) =>
  api.post(`/chat/conversations/${id}/messages`, { content }).then(r => r.data.data ?? r.data);

/**
 * ChatPanel — Full panel rendered inside the floating widget.
 * Uses socket for real-time + REST for history fallback.
 */
export default function ChatPanel({ onClose }) {
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [convId, setConvId] = useState(null);
  const [historyMsgs, setHistoryMsgs] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingDebounceRef = useRef(null);

  const {
    realtimeMessages, setRealtimeMessages,
    isTyping, sendMessage, emitTyping, markRead, connected,
  } = useConversation(convId);

  // Initialize conversation on mount
  useEffect(() => {
    startOrGetConversation()
      .then(conv => {
        const id = conv._id ?? conv.conversationId;
        setConvId(id);
        return fetchMessages(id).then(msgs => {
          const list = Array.isArray(msgs) ? msgs : (msgs?.messages ?? []);
          setHistoryMsgs(list);
        });
      })
      .catch(err => console.warn('[chat] init error:', err))
      .finally(() => setInitializing(false));
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historyMsgs, realtimeMessages]);

  // Mark read when panel opens
  useEffect(() => {
    if (convId && connected) markRead();
  }, [convId, connected]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const allMessages = [
    ...historyMsgs,
    ...realtimeMessages.filter(rt => !historyMsgs.some(h => h._id === rt._id)),
  ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const handleSend = () => {
    if (!text.trim() || !convId) return;
    if (connected) {
      sendMessage(text.trim());
    } else {
      // Fallback to REST
      sendRestMessage(convId, text.trim()).then(msg => {
        setHistoryMsgs(prev => [...prev, msg]);
      });
    }
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    emitTyping();
    clearTimeout(typingDebounceRef.current);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0071E3] rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white leading-tight">Support Chat</p>
            <div className="flex items-center gap-1 mt-0.5">
              {connected
                ? <><div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" /><span className="text-[11px] text-white/70">Online</span></>
                : <><div className="w-1.5 h-1.5 rounded-full bg-white/30" /><span className="text-[11px] text-white/50">Connecting…</span></>
              }
            </div>
          </div>
        </div>
        <button onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
          <X className="w-4 h-4 text-white" strokeWidth={2} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">
        {initializing ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-[#D2D2D7] animate-spin" strokeWidth={1.75} />
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MessageCircle className="w-10 h-10 text-[#D2D2D7] mb-3" strokeWidth={1.5} />
            <p className="text-[14px] font-medium text-[#1D1D1F] mb-1">Start the conversation</p>
            <p className="text-[12px] text-[#86868B]">Our support team typically replies within minutes.</p>
          </div>
        ) : (
          allMessages.map((msg, i) => (
            <ChatMessage key={msg._id ?? i} message={msg} />
          ))
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0071E3] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">S</span>
            </div>
            <div className="bg-[#F5F5F7] rounded-2xl rounded-bl-sm px-3.5 py-2.5">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#86868B] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-3 py-3 border-t border-[#F5F5F7] bg-white rounded-b-2xl">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => { setText(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 resize-none bg-[#F5F5F7] rounded-xl px-3 py-2.5 text-[14px] text-[#1D1D1F] placeholder:text-[#C7C7CC] outline-none max-h-[100px] overflow-y-auto"
            style={{ height: 'auto', minHeight: '40px' }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || !convId}
            className="w-9 h-9 rounded-full bg-[#0071E3] disabled:bg-[#D2D2D7] hover:bg-[#0077ED] flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
          >
            <Send className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[11px] text-[#C7C7CC] text-center mt-2">
          {connected ? 'Press Enter to send' : 'Reconnecting to chat…'}
        </p>
      </div>
    </div>
  );
}
