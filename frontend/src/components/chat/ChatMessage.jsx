import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

/**
 * A single chat message bubble.
 */
export default function ChatMessage({ message }) {
  const { user } = useAuthStore();
  const isOwn = message.sender === user?._id || message.senderRole === 'customer';

  const timeAgo = message.createdAt
    ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
    : '';

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isOwn && (
        <div className="w-7 h-7 rounded-full bg-[#0071E3] flex items-center justify-center flex-shrink-0 mt-auto">
          <span className="text-[10px] font-bold text-white">S</span>
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[75%] group`}>
        <div className={`
          px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed break-words
          ${isOwn
            ? 'bg-[#0071E3] !text-white rounded-br-sm'
            : 'bg-[#F5F5F7] text-[#1D1D1F] rounded-bl-sm'
          }
        `}>
          {message.content}
        </div>
        {timeAgo && (
          <p className={`text-[11px] text-[#86868B] mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? 'text-right' : 'text-left'}`}>
            {timeAgo}
          </p>
        )}
      </div>
    </div>
  );
}
