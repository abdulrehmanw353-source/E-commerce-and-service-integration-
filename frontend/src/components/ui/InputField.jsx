import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Apple-styled Input Field
 * 
 * Supports: text, email, password, tel, textarea
 * Features: floating-style stacked label, validation error display,
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

  const baseClasses = `
    w-full px-4 py-3 
    bg-bg-secondary 
    border border-transparent
    rounded-xl
    text-[17px] text-label-primary 
    placeholder:text-label-placeholder
    font-normal
    transition-all duration-200 ease-out
    outline-none
    focus:border-apple-blue focus:bg-bg-primary focus:shadow-sm
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-apple-red bg-red-50/30' : ''}
    ${type === 'password' ? 'pr-12' : ''}
  `;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={id || name} 
          className="text-[13px] font-medium text-label-secondary tracking-tight pl-1"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-label-quaternary hover:text-label-secondary transition-colors"
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
        <div className="flex items-center gap-1.5 pl-1 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-apple-red flex-shrink-0" strokeWidth={2} />
          <span className="text-[13px] text-apple-red font-normal">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
