{/* 
  مكون حقل الإدخال
  Input Field Component
  
  هذا المكون يوفر حقل إدخال قابل لإعادة الاستخدام مع دعم للغة العربية
  This component provides a reusable input field with Arabic language support
*/}

'use client';

import React, { useState, useEffect } from 'react';

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  arabicLabel: string;
  type?: string;
  placeholder?: string;
  arabicPlaceholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  arabicError?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

export default function InputField({
  id,
  name,
  label,
  arabicLabel,
  type = 'text',
  placeholder,
  arabicPlaceholder,
  value,
  onChange,
  required = false,
  error,
  arabicError,
  className = '',
  min,
  max,
  step,
}: InputFieldProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {language === 'ar' ? arabicLabel : label}
        {required && <span className="text-red-500 mr-1 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={language === 'ar' ? arabicPlaceholder : placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary'
          }
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
        `}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {language === 'ar' ? arabicError : error}
        </p>
      )}
    </div>
  );
}
