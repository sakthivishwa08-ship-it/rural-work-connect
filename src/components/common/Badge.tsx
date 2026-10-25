import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'neutral' | 'brand';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs sm:text-sm px-2.5 py-1 font-semibold',
  };

  const variantStyles = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-amber-100 text-amber-900 border border-amber-200',
    info: 'bg-sky-100 text-sky-800 border border-sky-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    brand: 'bg-brand-100 text-brand-900 border border-brand-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
