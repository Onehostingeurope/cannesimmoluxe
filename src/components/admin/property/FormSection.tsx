import React from 'react';
import { Headline, Label } from '../../ui/Typography';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
  id?: string;
}

export const FormSection = ({ title, subtitle, icon, children, id }: FormSectionProps) => {
  return (
    <section id={id} className="bg-white dark:bg-[#121212] border border-outline-variant/10 p-8 lg:p-10 space-y-8 animate-luxury-fade">
      <div className="flex items-start gap-6 border-b border-outline-variant/10 pb-6">
        {icon && (
          <div className="w-12 h-12 bg-[#f6f3ee] dark:bg-[#1c1b1b] flex items-center justify-center border border-outline-variant/10 text-secondary">
            <span className="material-symbols-outlined notranslate text-2xl" translate="no">{icon}</span>
          </div>
        )}
        <div className="space-y-1">
          <Headline className="text-xl md:text-2xl text-primary">{title}</Headline>
          {subtitle && <p className="text-sm text-outline opacity-70 italic font-serif">{subtitle}</p>}
        </div>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </section>
  );
};
