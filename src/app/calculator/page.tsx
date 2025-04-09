{/* 
  صفحة الحاسبة
  Calculator Page
  
  هذه الصفحة تعرض حاسبة التكلفة والربح للمزرعة
  This page displays the farm cost and profit calculator
*/}

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import CostProfitCalculator from '@/components/calculator/CostProfitCalculator';

export default function CalculatorPage() {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Cost & Profit Calculator" 
        arabicTitle="حاسبة التكلفة والربح" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'حاسبة التكلفة والربح' : 'Cost & Profit Calculator'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {language === 'ar' 
              ? 'استخدم هذه الأداة لتقدير التكاليف والإيرادات والأرباح لعمليات تربية الدواجن' 
              : 'Use this tool to estimate costs, revenues, and profits for poultry farming operations'}
          </p>
        </div>
        
        <CostProfitCalculator />
      </main>
      
      <BottomNavigation />
    </div>
  );
}
