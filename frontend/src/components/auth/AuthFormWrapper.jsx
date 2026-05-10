import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Auth Form Wrapper — Shared container for Login / Register pages
 * Dark-neon theme, centered ds-shell card.
 */
export default function AuthFormWrapper({
  title,
  subtitle,
  children,
  backTo = '/',
  backLabel = 'Home',
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Back Link */}
      <div className="px-6 sm:px-12 py-5">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-[13px] text-white/70 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/[0.06]"
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
              <span className="text-[20px] font-bold tracking-[-0.02em] text-[#f3f0ff]">
                DoorSet<span className="text-[#8f74ff]">Fix</span>
              </span>
            </Link>
            <h1 className="text-[30px] sm:text-[40px] font-extrabold tracking-[-0.03em] text-white leading-[1.1]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[14px] text-white/55 font-medium leading-relaxed mt-3">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Card — with visible border + generous padding */}
          <div
            className="ds-shell p-3"
          >
            <div className="ds-card p-6 sm:p-7">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
