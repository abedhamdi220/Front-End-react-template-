import React from "react";
import { X } from "lucide-react";

export const Button = ({ children, onClick, variant = "primary", size = "md", className = "", ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none";
  const variants = {
    primary: "bg-gradient-to-l from-[#D4AF37] to-[#B8941F] text-white hover:opacity-90 shadow-md",
    outline: "border border-[#3E2723]/20 text-[#3E2723] hover:bg-[#3E2723]/5",
    ghost: "text-[#5D4037] hover:bg-black/5",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl overflow-hidden ${className}`}>{children}</div>
);
export const CardHeader = ({ children, className = "" }) => <div className={`p-4 border-b border-[#3E2723]/10 ${className}`}>{children}</div>;
export const CardTitle = ({ children, className = "" }) => <h3 className={`font-semibold text-[#3E2723] ${className}`}>{children}</h3>;
export const CardContent = ({ children, className = "" }) => <div className={`p-4 ${className}`}>{children}</div>;

export const Input = ({ className = "", ...props }) => (
  <input className={`w-full px-4 py-2 rounded-xl border border-[#3E2723]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 ${className}`} {...props} />
);

export const Label = ({ children, className = "" }) => (
  <label className={`block text-sm font-medium text-[#5D4037] mb-1 ${className}`}>{children}</label>
);

export const Dialog = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-[#F5F0E8] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-[#3E2723]/10">
          <h2 className="text-lg font-bold text-[#3E2723]">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full text-[#5D4037]"><X size={20}/></button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
        {footer && <div className="p-4 border-t border-[#3E2723]/10 bg-white/30 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};
