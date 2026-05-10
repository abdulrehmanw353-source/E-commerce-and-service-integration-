import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import adminApi from '../../lib/adminAxios';

const fetchConversations = () =>
  adminApi.get('/admin/chat/conversations').then(r => r.data.data ?? r.data);
const fetchMessages = (id) =>
  adminApi.get(`/admin/chat/conversations/${id}/messages`).then(r => r.data.data ?? r.data);
const sendMessage = ({ id, message }) =>
  adminApi.post(`/admin/chat/conversations/${id}/messages`, { message }).then(r => r.data);
const closeConversation = (id) =>
  adminApi.patch(`/admin/chat/conversations/${id}/close`).then(r => r.data);

export default function AdminChatPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [msg, setMsg] = useState('');
  const bottomRef = useRef(null);

  const { data: convData, isLoading: convLoading } = useQuery({
    queryKey: ['admin-conversations'],
    queryFn: fetchConversations,
    refetchInterval: 10_000,
  });

  const conversations = Array.isArray(convData)
    ? convData
    : (convData?.conversations ?? []);

  const { data: msgData } = useQuery({
    queryKey: ['admin-messages', selected?._id],
    queryFn: () => fetchMessages(selected._id),
    enabled: !!selected?._id,
    refetchInterval: 5_000,
  });

  const messages = Array.isArray(msgData)
    ? msgData
    : (msgData?.messages ?? []);

  const sendMut = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      qc.invalidateQueries(['admin-messages', selected?._id]);
      setMsg('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send.'),
  });

  const closeMut = useMutation({
    mutationFn: closeConversation,
    onSuccess: () => {
      qc.invalidateQueries(['admin-conversations']);
      toast.success('Conversation closed.');
      setSelected(null);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!msg.trim() || !selected?._id) return;
    sendMut.mutate({ id: selected._id, message: msg.trim() });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-[280px] flex-shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="px-4 py-4 border-b border-white/[0.06]">
          <h2 className="text-[13px] font-semibold text-white/60 uppercase tracking-wider">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
          {convLoading
            ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-4">
                <div className="h-4 bg-white/[0.06] rounded-full animate-pulse mb-2 w-3/4" />
                <div className="h-3 bg-white/[0.04] rounded-full animate-pulse w-1/2" />
              </div>
            ))
            : conversations.length === 0
              ? <p className="px-4 py-8 text-[13px] text-white/25 text-center">No conversations</p>
              : conversations.map(c => (
                <button
                  key={c._id}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left px-4 py-3.5 transition-colors ${selected?._id === c._id
                    ? 'bg-white/[0.07]'
                    : 'hover:bg-white/[0.03]'}`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[13px] font-medium text-white truncate">
                      {c.customer?.firstName ?? c.user?.firstName ?? 'Unknown'} {c.customer?.lastName ?? c.user?.lastName ?? ''}
                    </p>
                    {c.status === 'open' && (
                      <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/30 truncate">
                    {c.lastMessage ?? 'No messages yet'}
                  </p>
                </button>
              ))
          }
        </div>
      </div>

      {/* Chat Window */}
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
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] flex-shrink-0">
              <div>
                <p className="text-[14px] font-semibold text-white">
                  {selected.customer?.firstName ?? selected.user?.firstName} {selected.customer?.lastName ?? selected.user?.lastName}
                </p>
                <p className="text-[11px] text-white/35">{selected.customer?.email ?? selected.user?.email}</p>
              </div>
              <div className="flex gap-2">
                {selected.status !== 'closed' && (
                  <button
                    onClick={() => closeMut.mutate(selected._id)}
                    disabled={closeMut.isPending}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-40 transition-all"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.length === 0
                ? <p className="text-center text-[13px] text-white/25 py-8">No messages yet</p>
                : messages.map((m, i) => {
                  const isAdmin = m.sender?.role === 'admin' || m.senderRole === 'admin' || m.isAdmin;
                  return (
                    <div key={m._id ?? i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[70%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed
                        ${isAdmin
                          ? 'bg-[#0071E3] text-white rounded-br-md'
                          : 'bg-[#2C2C2E] text-white/80 rounded-bl-md border border-white/[0.06]'}
                      `}>
                        {m.message ?? m.text ?? m.content}
                        <p className={`text-[10px] mt-1 ${isAdmin ? 'text-white/50' : 'text-white/30'}`}>
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                    </div>
                  );
                })
              }
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {selected.status !== 'closed' ? (
              <form onSubmit={handleSend} className="flex gap-3 px-5 py-4 border-t border-white/[0.06] flex-shrink-0">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  className="flex-1 bg-[#2C2C2E] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/25 outline-none focus:border-[#0071E3] transition-all"
                />
                <button type="submit" disabled={!msg.trim() || sendMut.isPending}
                  className="w-10 h-10 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-40 flex items-center justify-center flex-shrink-0 transition-all">
                  <Send className="w-4 h-4 text-white" strokeWidth={1.75} />
                </button>
              </form>
            ) : (
              <div className="px-5 py-4 border-t border-white/[0.06] flex-shrink-0">
                <p className="text-center text-[12px] text-white/25">This conversation is closed.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
