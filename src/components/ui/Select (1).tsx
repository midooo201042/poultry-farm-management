{/* 
  مكون القائمة المنسدلة
  Select Component
  
  هذا المكون يوفر قائمة منسدلة قابلة لإعادة الاستخدام مع دعم للغة العربية
  This component provides a reusable select dropdown with Arabic language support
*/}

'use client';

import React, { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  arabicLabel: string;
}

interface SelectProps {
  id: string;
  name: string;
  label: string;
  arabicLabel: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  arabicError?: string;
  className?: string;
}

export default function Select({
  id,
  name,
  label,
  arabicLabel,
  options,
  value,
  onChange,
  required = false,
  error,
  arabicError,
  className = '',
}: SelectProps) {
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
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary
          ${error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 dark:border-gray-600 focus:border-primary dark:focus:border-primary'
          }
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
        `}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <option value="">{language === 'ar' ? 'اختر...' : 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {language === 'ar' ? option.arabicLabel : option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {language === 'ar' ? arabicError : error}
        </p>
      )}
    </div>
  );
}
