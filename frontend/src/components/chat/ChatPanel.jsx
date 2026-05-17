import { useRef, useState, useEffect } from 'react';
import { MessageCircle, Loader2, Send, X } from 'lucide-react';
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

  const [text, setText] = useState('');
  const [convId, setConvId] = useState(null);
  const [historyMsgs, setHistoryMsgs] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingDebounceRef = useRef(null);

  const {
    realtimeMessages,
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
          setHistoryMsgs([...list].reverse());
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
      <div className="flex items-center justify-between px-4 py-3 bg-[#0071E3] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white leading-tight">Support Chat</p>
            <div className="flex items-center gap-1 mt-0.5">
              {connected
                ? <><div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" /><span className="text-[11px] text-white/70">Online</span></>
                : <><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-[11px] text-white/70">We reply within 12 hours</span></>
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
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#0f1425]">
        {initializing ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-white/25 animate-spin" strokeWidth={1.75} />
          </div>
        ) : allMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <MessageCircle className="w-10 h-10 text-white/25 mb-3" strokeWidth={1.5} />
            <p className="text-[14px] font-semibold text-white mb-1">Hi there! 👋 How can we help?</p>
            <p className="text-[12px] text-white/45">Send us a message and we'll get back to you within 12 hours, even if we're currently offline.</p>
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
      <div className="flex-shrink-0 px-3 py-3 border-t border-white/10 bg-[#0f1425]">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => { setText(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 resize-none bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 text-[14px] text-white placeholder:text-white/35 outline-none max-h-[100px] overflow-y-auto focus:border-[#2d8cff]/45 focus:ring-4 focus:ring-[#2d8cff]/15 transition-all"
            style={{ height: 'auto', minHeight: '40px' }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || !convId}
            className="w-10 h-10 rounded-xl bg-[#0071E3] disabled:bg-white/[0.08] hover:bg-[#0077ED] flex items-center justify-center flex-shrink-0 transition-all active:scale-95"
          >
            <Send className="w-4 h-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <p className="text-[11px] text-white/35 text-center mt-2">
          {connected ? 'Press Enter to send' : 'You can still send messages — we\'ll reply within 12 hours'}
        </p>
      </div>
    </div>
  );
}
