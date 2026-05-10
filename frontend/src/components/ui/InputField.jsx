import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Apple-styled Input Field
 * 
 * Supports: text, email, password, tel, textarea
 * Features: stacked label, validation error display,
 * Apple focus ring, password toggle, subtle transitions
 */
export default function InputField({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  error,
  disabled = false,
  register,      // react-hook-form register
  className = '',
  rows = 4,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === 'textarea';
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  const baseClasses = [
    'w-full px-4 py-[13px]',
    'bg-[#F5F5F7]',
    'border border-[#D2D2D7]',
    'rounded-[12px]',
    'text-[17px] text-label-primary',
    'placeholder:text-[#86868B]',
    'font-normal tracking-[-0.022em]',
    'transition-all duration-200 ease-out',
    'outline-none',
    'focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/15 focus:bg-white',
    'disabled:opacity-40 disabled:cursor-not-allowed',
    error ? 'border-apple-red/60 bg-apple-red/[0.03]' : '',
    type === 'password' ? 'pr-12' : '',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className="text-[14px] font-medium text-label-primary tracking-[-0.01em] pl-0.5"
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {isTextarea ? (
          <textarea
            id={id || name}
            name={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={`${baseClasses} resize-none`}
            {...(register ? register(name) : {})}
            {...props}
          />
        ) : (
          <input
            id={id || name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            className={baseClasses}
            {...(register ? register(name) : {})}
            {...props}
          />
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#86868B] hover:text-label-secondary transition-colors rounded-md"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" strokeWidth={1.5} />
            ) : (
              <Eye className="w-[18px] h-[18px]" strokeWidth={1.5} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 pl-0.5 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-apple-red flex-shrink-0" strokeWidth={2} />
          <span className="text-[13px] text-apple-red font-normal leading-tight">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
