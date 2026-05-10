import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Auth Form Wrapper — Shared container for Login / Register pages
 * 
 * Clean white/gray Apple-style background. Centered card,
 * slide-up animation on mount. Used by customer auth pages.
 */
export default function AuthFormWrapper({
  title,
  subtitle,
  children,
  backTo = '/',
  backLabel = 'Home',
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Minimal Header */}
      <div className="px-6 sm:px-10 py-4 sm:py-5">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-[15px] text-apple-blue hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {backLabel}
        </Link>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 pb-16 pt-4">
        <div className="w-full max-w-[460px] animate-slide-up">
          {/* Brand */}
          <div className="text-center mb-8 sm:mb-10">
            <Link to="/" className="inline-block mb-3">
              <span className="text-[20px] font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                TechStore
              </span>
            </Link>
            <h1 className="text-[30px] sm:text-[36px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-[1.1] mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[17px] text-[#86868B] font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl px-7 py-8 sm:px-10 sm:py-10 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.04)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
