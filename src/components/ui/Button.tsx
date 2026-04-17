import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const baseStyles = "px-8 py-4 font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-500 active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-container shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
    secondary: "bg-secondary text-on-secondary hover:bg-secondary/90",
    ghost: "bg-transparent text-luxury-charcoal hover:bg-surface-container-high",
    outline: "border border-outline-variant/30 text-secondary hover:bg-surface-container-lowest hover:text-primary"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
