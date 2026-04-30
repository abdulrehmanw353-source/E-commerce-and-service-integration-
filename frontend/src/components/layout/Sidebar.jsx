import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  // Prevent scrolling on body when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="relative flex w-full max-w-[300px] flex-col bg-bg-primary h-full shadow-2xl animate-fade-in" style={{ animation: 'slide-right 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' }}>
        {/* Header */}
        <div className="flex items-center justify-between h-[48px] px-6 border-b border-separator">
          <span className="text-[21px] font-semibold tracking-tight text-label-primary">
            Menu
          </span>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-secondary text-label-secondary hover:bg-bg-tertiary transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1">
          {['Products', 'Services', 'Support'].map((item) => (
            <button
              key={item}
              className="text-left text-[17px] font-medium text-label-primary py-3 border-b border-separator last:border-0 hover:text-apple-blue transition-colors"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-separator bg-bg-secondary">
          <button className="apple-btn apple-btn-primary w-full text-[17px]">
            Sign In
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-right {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
