import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// Primary uses the ink/navy brand color instead of a stock blue, and gets a
// slight press-down on click (translate + shadow drop) — the kind of tiny
// tactile detail that's easy to skip when a whole UI gets generated in one pass.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ink-800 hover:bg-ink-900 text-white shadow-sm active:translate-y-px active:shadow-none',
  secondary:
    'bg-white hover:bg-slate-50 text-ink-800 border border-slate-300 shadow-sm active:translate-y-px',
  danger:
    'bg-red-700 hover:bg-red-800 text-white shadow-sm active:translate-y-px active:shadow-none',
  ghost:
    'hover:bg-slate-100 text-slate-600 active:translate-y-px',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}) => (
  <button
    className={`inline-flex items-center gap-2 rounded-md font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...rest}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    {children}
  </button>
);

export default Button;
