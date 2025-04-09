{/* 
  مكون بطاقة
  Card Component
  
  هذا المكون يوفر بطاقة قابلة لإعادة الاستخدام لعرض المعلومات
  This component provides a reusable card for displaying information
*/}

import React from 'react';

interface CardProps {
  title?: string;
  arabicTitle?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export default function Card({ 
  title, 
  arabicTitle, 
  children, 
  className = '', 
  footer 
}: CardProps) {
  // استرجاع إعدادات اللغة من التخزين المحلي - Get language setting from client side
  const [language, setLanguage] = React.useState<'ar' | 'en'>('ar');
  
  React.useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || arabicTitle) && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {language === 'ar' ? arabicTitle : title}
          </h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}
