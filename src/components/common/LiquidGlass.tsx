import React from 'react';

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  interactive?: boolean;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  ...props
}) => {
  const variantClass = {
    default: 'liquid-glass',
    elevated: 'liquid-glass-elevated',
    subtle: 'liquid-glass-subtle',
  }[variant];

  const interactiveClass = interactive ? 'liquid-glass-hover cursor-pointer' : '';

  return (
    <div
      className={`rounded-2xl transition-all duration-300 relative ${variantClass} ${interactiveClass} ${className}`}
      {...props}
    >
      {/* Specular highlight hairline sheen at top */}
      <div 
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-t-2xl"
        aria-hidden="true" 
      />
      {children}
    </div>
  );
};

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size];

  const variantClass = {
    primary:
      'bg-white text-black font-semibold hover:bg-neutral-200 active:scale-[0.98] shadow-lg shadow-white/5 transition-all duration-200',
    secondary:
      'liquid-glass text-neutral-200 hover:text-white hover:bg-white/10 active:scale-[0.98] transition-all duration-200',
    ghost:
      'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 transition-colors duration-200',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl whitespace-nowrap shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
