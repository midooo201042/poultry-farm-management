{/* 
  مكون النموذج
  Form Component
  
  هذا المكون يوفر نموذج قابل لإعادة الاستخدام مع دعم للغة العربية
  This component provides a reusable form with Arabic language support
*/}

'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Button from './Button';

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
  arabicSubmitLabel?: string;
  cancelLabel?: string;
  arabicCancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

export default function Form({
  children,
  onSubmit,
  submitLabel = 'Save',
  arabicSubmitLabel = 'حفظ',
  cancelLabel = 'Cancel',
  arabicCancelLabel = 'إلغاء',
  onCancel,
  isLoading = false,
  className = '',
}: FormProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {children}
      
      <div className="flex justify-end space-x-4 rtl:space-x-reverse">
        {onCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {language === 'ar' ? arabicCancelLabel : cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? arabicSubmitLabel : submitLabel)}
        </Button>
      </div>
    </form>
  );
}
