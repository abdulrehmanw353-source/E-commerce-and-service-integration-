import { Loader2 } from 'lucide-react';

/**
 * Apple-styled Button Component
 * 
 * Variants: primary (blue pill), secondary (gray fill), ghost (text only), danger (red)
 * Supports: loading state, disabled, icons, full-width
 */

const variants = {
  primary: `
    !bg-[#007AFF] text-white
    hover:!bg-[#0071E3]
    active:scale-[0.97] active:!bg-[#006ADB]
  `,
  secondary: `
    !bg-[#E8E8ED] text-[#007AFF]
    hover:!bg-[#DCDCE2]
    active:!bg-[#D2D2D7] active:scale-[0.97]
  `,
  ghost: `
    !bg-transparent text-[#007AFF]
    hover:!bg-[#F5F5F7]
    active:!bg-[#E8E8ED] active:scale-[0.97]
  `,
  danger: `
    !bg-[#FF3B30] text-white
    hover:!bg-[#E8342B]
    active:scale-[0.97] active:!bg-[#D12D25]
  `,
};

const sizes = {
  sm: 'px-5 py-2 text-[15px] gap-1.5',
  md: 'px-6 py-[11px] text-[17px] gap-2',
  lg: 'px-8 py-[13px] text-[17px] gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  id,
  className = '',
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      id={id}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        font-medium tracking-[-0.022em]
        rounded-full
        transition-all duration-150 ease-out
        cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 className="w-[18px] h-[18px] animate-spin" strokeWidth={2} />
      )}
      {children}
    </button>
  );
}
