import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, Search, X, CheckCheck, Wifi, WifiOff, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import adminApi from '../../lib/adminAxios';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { initAdminSocket, destroyAdminSocket } from '../../lib/socket';

// ─── API ──────────────────────────────────────────────────────
const fetchConversations = () =>
  adminApi.get('/admin/chat/conversations').then(r => r.data.data ?? r.data);
const fetchMessages = (id) =>
  adminApi.get(`/admin/chat/conversations/${id}/messages`).then(r => r.data.data ?? r.data);
const sendRestMsg = ({ id, content }) =>
  adminApi.post(`/admin/chat/conversations/${id}/messages`, { content }).then(r => r.data.data ?? r.data);
const closeConversation = (id) =>
  adminApi.patch(`/admin/chat/conversations/${id}/close`).then(r => r.data);

// ─── Message Bubble ──────────────────────────────────────────
function MsgBubble({ m }) {
  const isAdmin = m.senderRole === 'admin' || m.sender?.role === 'admin' || m.isAdmin;
  const time = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed
        ${isAdmin
          ? 'bg-[#0071E3] text-white rounded-br-sm'
          : 'bg-[#2C2C2E] text-white/85 rounded-bl-sm border border-white/[0.06]'
        }
      `}>
        {m.content ?? m.message ?? m.text}
        {time && <p className={`text-[10px] mt-1 ${isAdmin ? 'text-white/80' : 'text-white/30'}`}>{time}</p>}
      </div>
    </div>
  );
}

// ─── Conversation Row ─────────────────────────────────────────
function ConvRow({ c, isSelected, onClick }) {
  const name = `${c.customer?.firstName ?? c.user?.firstName ?? 'Customer'} ${c.customer?.lastName ?? c.user?.lastName ?? ''}`.trim();
  const timeAgo = c.lastMessageAt
    ? formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: true })
    : '';
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3.5 transition-colors
        ${isSelected ? 'bg-white/[0.07]' : 'hover:bg-white/[0.03]'}
      `}
    >
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-[13px] font-semibold text-white truncate flex-1">{name}</p>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {c.status === 'open' && <span className="w-2 h-2 rounded-full bg-green-400" />}
          {c.unreadCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 bg-[#0071E3] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
              {c.unreadCount}
            </span>
          )}
        </div>
      </div>
      <p className="text-[11px] text-white/30 truncate">{c.lastMessage ?? 'No messages yet'}</p>
      {timeAgo && <p className="text-[10px] text-white/20 mt-0.5">{timeAgo}</p>}
    </button>
  );
}

export default function AdminChatPage() {
  const qc = useQueryClient();
  const { accessToken } = useAdminAuthStore();
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);
  const socketRef = useRef(null);

  // ─── Socket setup ────────────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return;
    const s = initAdminSocket(accessToken);
    socketRef.current = s;

    s.on('connect',    () => setSocketConnected(true));
    s.on('disconnect', () => setSocketConnected(false));

    return () => {
      s.off('connect');
      s.off('disconnect');
    };
  }, [accessToken]);

  // ─── Join room on conversation select ────────────────────────
  useEffect(() => {
    const s = socketRef.current;
    if (!s || !selected?._id) return;

    s.emit('joinConversation', selected._id);

    const onNew = (m) => {
      setMessages(prev => prev.some(x => x._id === m._id) ? prev : [...prev, m]);
      qc.invalidateQueries(['admin-conversations']);
    };
    const onTyping   = () => { setIsTyping(true); clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => setIsTyping(false), 2500); };
    const onStopped  = () => { setIsTyping(false); clearTimeout(typingTimer.current); };
    const onConvUpd  = ({ conversationId }) => { if (conversationId !== selected._id) qc.invalidateQueries(['admin-conversations']); };

    s.on('newMessage',        onNew);
    s.on('userTyping',        onTyping);
    s.on('userStoppedTyping', onStopped);
    s.on('conversationUpdated', onConvUpd);

    return () => {
      s.emit('leaveConversation', selected._id);
      s.off('newMessage',        onNew);
      s.off('userTyping',        onTyping);
      s.off('userStoppedTyping', onStopped);
      s.off('conversationUpdated', onConvUpd);
      clearTimeout(typingTimer.current);
    };
  }, [selected?._id, qc]);

  // ─── Fetch conversations ──────────────────────────────────────
  const { data: convData, isLoading: convLoading } = useQuery({
    queryKey: ['admin-conversations'],
    queryFn: fetchConversations,
    refetchInterval: 15_000,
  });

  const allConversations = Array.isArray(convData) ? convData : (convData?.conversations ?? []);
  const conversations = search
    ? allConversations.filter(c => {
        const name = `${c.customer?.firstName ?? ''} ${c.customer?.lastName ?? ''}`.toLowerCase();
        return name.includes(search.toLowerCase());
      })
    : allConversations;

  // ─── Fetch messages on select ─────────────────────────────────
  const { data: messagesData, isLoading: msgLoading } = useQuery({
    queryKey: ['admin-messages', selected?._id],
    queryFn: () => fetchMessages(selected._id),
    enabled: !!selected?._id,
  });

  useEffect(() => {
    if (messagesData) {
      const list = Array.isArray(messagesData) ? messagesData : (messagesData?.messages ?? []);
      // Reverse to show newest at bottom
      setMessages([...list].reverse());
    }
  }, [messagesData]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ─── Mutations ────────────────────────────────────────────────
  const sendMut = useMutation({
    mutationFn: sendRestMsg,
    onSuccess: (newMsg) => {
      if (newMsg?._id) setMessages(prev => prev.some(m => m._id === newMsg._id) ? prev : [...prev, newMsg]);
      qc.invalidateQueries(['admin-conversations']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send.'),
  });

  const closeMut = useMutation({
    mutationFn: closeConversation,
    onSuccess: () => { qc.invalidateQueries(['admin-conversations']); toast.success('Conversation closed.'); setSelected(null); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to close.'),
  });

  const handleSend = (e) => {
    e?.preventDefault();
    if (!msg.trim() || !selected?._id) return;
    const s = socketRef.current;
    if (s?.connected) {
      s.emit('sendMessage', { conversationId: selected._id, content: msg.trim() });
      s.emit('stopTyping', selected._id);
    } else {
      sendMut.mutate({ id: selected._id, content: msg.trim() });
    }
    setMsg('');
  };

  const handleTyping = () => {
    const s = socketRef.current;
    if (s?.connected && selected?._id) s.emit('typing', selected._id);
  };

  const selectedName = selected
    ? `${selected.customer?.firstName ?? selected.user?.firstName ?? ''} ${selected.customer?.lastName ?? selected.user?.lastName ?? ''}`.trim()
    : '';

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Conversations Sidebar ── */}
      <div className="w-[280px] flex-shrink-0 border-r border-white/[0.06] flex flex-col bg-[#111111]">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-white/60 uppercase tracking-wider">Conversations</h2>
            <div className="flex items-center gap-1">
              {socketConnected
                ? <><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[10px] text-white/30">Live</span></>
                : <><div className="w-1.5 h-1.5 rounded-full bg-white/20" /><span className="text-[10px] text-white/20">Offline</span></>
              }
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" strokeWidth={1.75} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-white/[0.05] border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-[12px] text-white placeholder:text-white/25 outline-none focus:border-[#0071E3] transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {convLoading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-4">
                <div className="h-3.5 bg-white/[0.06] rounded-full animate-pulse mb-2 w-3/4" />
                <div className="h-2.5 bg-white/[0.04] rounded-full animate-pulse w-1/2" />
              </div>
            ))
            : conversations.length === 0
              ? <p className="px-4 py-8 text-[12px] text-white/25 text-center">No conversations</p>
              : conversations.map(c => (
                <ConvRow
                  key={c._id}
                  c={c}
                  isSelected={selected?._id === c._id}
                  onClick={() => { setSelected(c); setMessages([]); }}
                />
              ))
          }
        </div>
      </div>

      {/* ── Chat Window ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <MessageSquare className="w-12 h-12 text-white/15 mb-4" strokeWidth={1.5} />
            <p className="text-[15px] font-medium text-white/30">Select a conversation</p>
            <p className="text-[13px] text-white/20 mt-1">Choose from the left to reply</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0 bg-[#111111]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0071E3]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-bold text-[#0071E3]">{selectedName[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">{selectedName}</p>
                  <p className="text-[11px] text-white/35">
                    {selected.customer?.email ?? selected.user?.email}
                    {' · '}
                    <span className={selected.status === 'open' ? 'text-green-400' : 'text-white/25'}>
                      {selected.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.status !== 'closed' && (
                  <button
                    onClick={() => closeMut.mutate(selected._id)}
                    disabled={closeMut.isPending}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 transition-all"
                  >
                    {closeMut.isPending ? 'Closing…' : 'Close Chat'}
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {msgLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className="h-10 w-48 bg-white/[0.05] rounded-2xl animate-pulse" />
                  </div>
                ))
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <MessageSquare className="w-8 h-8 text-white/15 mb-2" strokeWidth={1.5} />
                  <p className="text-[13px] text-white/25">No messages yet</p>
                </div>
              ) : (
                messages.map((m, i) => <MsgBubble key={m._id ?? i} m={m} />)
              )}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#2C2C2E] rounded-2xl rounded-bl-sm px-4 py-2.5 border border-white/[0.06]">
                    <div className="flex items-center gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {selected.status !== 'closed' ? (
              <form onSubmit={handleSend} className="flex gap-3 px-5 py-4 border-t border-white/[0.06] flex-shrink-0 bg-[#111111]">
                <input
                  type="text"
                  placeholder="Type a message… (Enter to send)"
                  value={msg}
                  onChange={e => { setMsg(e.target.value); handleTyping(); }}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
                  className="flex-1 bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#0071E3] transition-all"
                />
                <button
                  type="submit"
                  disabled={!msg.trim() || sendMut.isPending}
                  className="w-10 h-10 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 disabled:bg-white/[0.08] flex items-center justify-center flex-shrink-0 transition-all"
                >
                  <Send className="w-4 h-4 text-white" strokeWidth={1.75} />
                </button>
              </form>
            ) : (
              <div className="px-5 py-4 border-t border-white/[0.06] flex-shrink-0 text-center">
                <p className="text-[12px] text-white/25">This conversation is closed.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
