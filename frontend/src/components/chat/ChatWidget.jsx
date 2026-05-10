import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ChatPanel from './ChatPanel';

/**
 * ChatWidget — floating bubble in the bottom-right corner.
 * Only renders for authenticated customers.
 * Opens/closes the ChatPanel.
 */
export default function ChatWidget() {
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Animate mount
  useEffect(() => {
    if (isAuthenticated) {
      const t = setTimeout(() => setMounted(true), 600);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
      setIsOpen(false);
    }
  }, [isAuthenticated]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!isAuthenticated || !mounted) return null;

  return (
    <>
      {/* ── Chat panel ── */}
      {isOpen && (
        <div
          className="fixed bottom-[80px] right-4 sm:right-6 z-50 w-[340px] h-[480px] ds-shell flex flex-col overflow-hidden p-2"
          style={{ animation: 'chatSlideUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          <div className="ds-card h-full overflow-hidden">
            <ChatPanel onClose={() => { setIsOpen(false); setHasUnread(false); }} />
          </div>
        </div>
      )}

      {/* ── Floating bubble ── */}
      <button
        id="chat-widget-btn"
        onClick={() => { setIsOpen(o => !o); setHasUnread(false); }}
        className={`
          fixed bottom-4 right-4 sm:right-6 z-50
          w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(0,113,227,0.4)]
          flex items-center justify-center
          transition-all duration-300
          ${isOpen
            ? 'bg-[#005BB5] hover:bg-[#004A99]'
            : 'bg-[#0071E3] hover:bg-[#0077ED]'
          }
          active:scale-95
        `}
        aria-label={isOpen ? 'Close chat' : 'Open support chat'}
      >
        <div className={`transition-all duration-200 ${isOpen ? 'rotate-0 scale-100' : 'rotate-0 scale-100'}`}>
          {isOpen
            ? <X className="w-6 h-6 text-white" strokeWidth={2} />
            : <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.75} />
          }
        </div>

        {/* Unread badge */}
        {!isOpen && hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3B30] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            !
          </span>
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </>
  );
}
