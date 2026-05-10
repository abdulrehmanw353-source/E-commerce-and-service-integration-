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
      <div className="px-8 py-5">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-[15px] text-apple-blue hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {backLabel}
        </Link>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px] animate-slide-up">
          {/* Brand */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-4">
              <span className="text-[22px] font-semibold tracking-tight text-label-primary">
                TechStore
              </span>
            </Link>
            <h1 className="text-[32px] sm:text-[36px] font-bold tracking-[-0.03em] text-label-primary leading-[1.1] mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[17px] text-[#86868B] font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.04)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
