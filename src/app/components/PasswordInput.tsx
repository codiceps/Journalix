'use client';
import React, { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Jika parent tidak memberikan style right-padding yang cukup, 
  // kita pastikan input punya ruang untuk icon mata di kanan.
  // Tapi kita membiarkan class eksternal mendominasi jika ada.
  const finalClassName = className ? className : "w-full pl-4 pr-12 py-3 bg-surface-container-low/30 border border-white/10 rounded-xl text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all";

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        className={finalClassName}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
        onClick={() => setShowPassword(!showPassword)}
      >
        <span 
          className={`material-symbols-outlined transition-all duration-200 ${showPassword ? 'opacity-100 scale-110' : 'opacity-80 scale-100'}`} 
          style={{ fontSize: '20px' }}
        >
          {showPassword ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}
