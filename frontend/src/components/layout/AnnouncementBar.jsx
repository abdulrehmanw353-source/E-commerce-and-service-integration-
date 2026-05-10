import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Announcement Bar — Apple-style thin promo banner
 * Sits at the very top of the storefront. Dismissible.
 */
export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-[#1D1D1F] text-white text-center" id="announcement-bar">
      <div className="apple-section-wide flex items-center justify-center py-2 px-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-[14px] font-normal text-white/90 hover:text-white transition-colors"
        >
          <span>
            Free shipping on all orders over $50.{' '}
            <span className="text-apple-teal font-medium">Shop now</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-apple-teal" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white/70 transition-colors rounded-full"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
}
