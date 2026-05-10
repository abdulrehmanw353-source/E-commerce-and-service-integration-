import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

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
          className="text-[11px] font-semibold text-white/45 uppercase tracking-[0.08em]"
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
              w-full rounded-xl border text-[14px] font-medium tracking-[-0.01em] outline-none
              transition-all duration-200 ease-out
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-[#1c2340] text-white placeholder:text-white/35
              focus:border-[#a894ff] focus:ring-[4px] focus:ring-[#8f74ff]/20 focus:bg-[#242c4b]
              resize-none
              ${error ? 'border-[#ff5e7d]/70' : 'border-[#7a5cff]/25 hover:border-[#9a84ff]/45'}
            `}
            style={{ padding: '12px 14px' }}
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
              w-full rounded-xl border text-[14px] text-white font-medium tracking-[-0.01em] outline-none
              placeholder:text-white/35
              transition-all duration-200 ease-out
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-[#1c2340]
              focus:border-[#a894ff] focus:ring-[4px] focus:ring-[#8f74ff]/20 focus:bg-[#242c4b]
              ${error ? 'border-[#ff5e7d]/70' : 'border-[#7a5cff]/25 hover:border-[#9a84ff]/45'}
              ${type === 'password' ? 'pr-12' : ''}
            `}
            style={{ padding: '12px 14px' }}
            {...(register ? register(name) : {})}
            {...props}
          />
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-white/35 hover:text-white/70 transition-colors rounded-md"
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
          <AlertCircle className="w-3.5 h-3.5 text-[#ff5e7d] flex-shrink-0" strokeWidth={2} />
          <span className="text-[12px] text-[#ff9aad] font-medium leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}
