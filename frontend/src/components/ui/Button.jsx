import { Loader2 } from 'lucide-react';

/**
 * Apple-styled Button Component
 * 
 * Variants: primary (blue pill), secondary (gray fill), ghost (text only), danger (red)
 * Supports: loading state, disabled, icons, full-width
 */

const variants = {
  primary: `
    bg-apple-blue text-white
    hover:opacity-90
    active:scale-[0.96] active:opacity-80
  `,
  secondary: `
    bg-fill-quaternary text-apple-blue
    hover:bg-fill-tertiary
    active:bg-fill-secondary active:scale-[0.96]
  `,
  ghost: `
    bg-transparent text-apple-blue
    hover:bg-fill-quaternary
    active:bg-fill-tertiary active:scale-[0.96]
  `,
  danger: `
    bg-apple-red text-white
    hover:opacity-90
    active:scale-[0.96] active:opacity-80
  `,
};

const sizes = {
  sm: 'px-4 py-2 text-[15px] gap-1.5',
  md: 'px-6 py-3 text-[17px] gap-2',
  lg: 'px-8 py-3.5 text-[17px] gap-2',
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
        font-normal tracking-[-0.022em]
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
