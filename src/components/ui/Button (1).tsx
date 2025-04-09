{/* 
  مكون الزر
  Button Component
  
  هذا المكون يوفر زر قابل لإعادة الاستخدام مع دعم للغة العربية
  This component provides a reusable button with Arabic language support
*/}

'use client';

import React, { useState, useEffect } from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  icon,
}: ButtonProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // تحديد الألوان حسب النوع
  // Set colors based on variant
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10',
  };

  // تحديد الحجم
  // Set size
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span className="flex items-center justify-center">
        {icon && <span className={`${children ? 'mr-2 rtl:ml-2 rtl:mr-0' : ''}`}>{icon}</span>}
        {children}
      </span>
    </button>
  );
}
