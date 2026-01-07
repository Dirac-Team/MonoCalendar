import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }> = ({ 
  className = '', 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 border border-transparent",
    secondary: "bg-white text-black border border-zinc-200 hover:bg-zinc-50 hover:border-black",
    ghost: "bg-transparent text-zinc-500 hover:text-black hover:bg-zinc-100"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props} />
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full bg-transparent border-b border-zinc-200 py-3 text-lg focus:outline-none focus:border-black transition-colors placeholder:text-zinc-400 ${className}`} 
    {...props} 
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea 
    className={`w-full bg-zinc-50 border border-zinc-200 p-4 text-base focus:outline-none focus:border-black focus:ring-0 transition-all resize-none ${className}`} 
    {...props} 
  />
);

export const CheckboxCard: React.FC<{ 
  checked: boolean; 
  onChange: () => void; 
  label: string;
}> = ({ checked, onChange, label }) => (
  <div 
    onClick={onChange}
    className={`
      cursor-pointer p-4 border transition-all duration-200 flex items-center justify-center text-center select-none
      ${checked ? 'bg-black text-white border-black' : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400'}
    `}
  >
    <span className="font-medium text-sm tracking-wide uppercase">{label}</span>
  </div>
);
