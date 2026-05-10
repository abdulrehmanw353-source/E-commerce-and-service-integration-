import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Auth Form Wrapper — Shared container for Login / Register pages
 * Clean #F5F5F7 background, centered white card, slide-up animation.
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
      {/* Back Link */}
      <div className="px-6 sm:px-12 py-5">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-[15px] text-apple-blue hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {backLabel}
        </Link>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 pb-20 pt-2">
        <div className="w-full max-w-[480px] animate-slide-up">
          {/* Brand Header */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-4">
              <span className="text-[18px] font-semibold tracking-[-0.02em] text-[#86868B]">
                TechStore
              </span>
            </Link>
            <h1 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-[1.1]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[17px] text-[#86868B] font-normal leading-relaxed mt-3">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Card — with visible border + generous padding */}
          <div
            className="bg-white rounded-[24px] border border-[#E8E8ED] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            style={{ padding: '40px 44px' }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
