import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Display = ({ children, className, as: Component = 'h1' }: TypographyProps) => (
  <Component className={cn("font-serif text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-luxury-charcoal", className)}>
    {children}
  </Component>
);

export const Headline = ({ children, className, as: Component = 'h2' }: TypographyProps) => (
  <Component className={cn("font-serif text-2xl md:text-3xl lg:text-4xl leading-snug text-luxury-charcoal", className)}>
    {children}
  </Component>
);

export const Title = ({ children, className, as: Component = 'h3' }: TypographyProps) => (
  <Component className={cn("font-sans text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-luxury-charcoal", className)}>
    {children}
  </Component>
);

export const Body = ({ children, className, as: Component = 'p' }: TypographyProps) => (
  <Component className={cn("font-sans text-base md:text-lg leading-relaxed text-luxury-charcoal/80", className)}>
    {children}
  </Component>
);

export const Label = ({ children, className, as: Component = 'span' }: TypographyProps) => (
  <Component className={cn("font-sans text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-luxury-gold font-medium", className)}>
    {children}
  </Component>
);
