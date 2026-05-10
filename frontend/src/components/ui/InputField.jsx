import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Apple-styled Input Field
 * Supports: text, email, password, tel, textarea
 */
export default function InputField({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  error,
  disabled = false,
  register,
  className = '',
  rows = 4,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === 'textarea';
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="text-[13px] font-semibold text-[#86868B] uppercase tracking-[0.04em]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {isTextarea ? (
          <textarea
            id={id || name}
            name={name}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full rounded-xl border text-[17px] font-normal tracking-[-0.022em] outline-none
              transition-all duration-200 ease-out
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/15 focus:bg-white
              resize-none
              ${error ? 'border-apple-red/50' : 'border-[#D2D2D7]'}
            `}
            style={{ padding: '14px 16px', backgroundColor: '#FAFAFA' }}
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
            className={`
              w-full rounded-xl border text-[17px] text-[#1D1D1F] font-normal tracking-[-0.022em] outline-none
              placeholder:text-[#C7C7CC]
              transition-all duration-200 ease-out
              disabled:opacity-40 disabled:cursor-not-allowed
              focus:border-apple-blue focus:ring-[3px] focus:ring-apple-blue/15 focus:bg-white
              ${error ? 'border-apple-red/50' : 'border-[#D2D2D7]'}
              ${type === 'password' ? 'pr-12' : ''}
            `}
            style={{ padding: '14px 16px', backgroundColor: '#FAFAFA' }}
            {...(register ? register(name) : {})}
            {...props}
          />
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#C7C7CC] hover:text-[#86868B] transition-colors rounded-md"
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

      {error && (
        <div className="flex items-center gap-1.5 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-apple-red flex-shrink-0" strokeWidth={2} />
          <span className="text-[13px] text-apple-red font-normal leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}
