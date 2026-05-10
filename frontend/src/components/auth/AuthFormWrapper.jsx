import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Auth Form Wrapper — Shared container for Login / Register pages
 * 
 * Centered card with brand header, Apple-styled container,
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
    <div className="min-h-screen flex flex-col bg-bg-secondary">
      {/* Minimal Header */}
      <div className="px-6 py-4">
        <Link
          to={backTo}
          className="inline-flex items-center gap-1.5 text-[15px] text-apple-blue hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          {backLabel}
        </Link>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[400px] animate-slide-up">
          {/* Brand */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <span className="text-[28px] font-semibold tracking-tight text-label-primary">
                TechStore
              </span>
            </Link>
            <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-tight text-label-primary leading-tight mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[17px] text-label-secondary font-normal">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-bg-primary rounded-2xl p-6 sm:p-8 shadow-lg border border-separator">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
