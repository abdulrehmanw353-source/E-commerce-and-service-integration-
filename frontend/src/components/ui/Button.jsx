import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'ds-btn-primary text-white hover:brightness-[1.07]',
  secondary: 'ds-btn-outline text-white/90 hover:text-white hover:bg-white/[0.06]',
  ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/[0.06] border border-transparent',
  danger: 'bg-[#ff3b57] text-white border border-[#ff3b57]/60 hover:bg-[#ff5e7d]',
  dark: 'bg-[#12182a] text-white border border-white/10 hover:bg-white/[0.06]',
};

const sizes = {
  sm: 'px-4 py-2 text-[13px] gap-1.5',
  md: 'px-5 py-2.5 text-[14px] gap-2',
  lg: 'px-6 py-3 text-[15px] gap-2',
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
        font-semibold tracking-[-0.01em]
        rounded-xl
        transition-all duration-150 ease-out
        cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        active:scale-[0.98]
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
