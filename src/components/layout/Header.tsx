{/* 
  مكون الرأس
  Header Component
  
  هذا المكون يوفر شريط علوي للتطبيق يحتوي على عنوان الصفحة وأزرار التحكم
  This component provides a top bar for the application containing the page title and control buttons
*/}

'use client';

import { useState, useEffect } from 'react';
import { Menu, Bell, Moon, Sun, Globe } from 'lucide-react';

interface HeaderProps {
  title: string;
  arabicTitle: string;
}

export default function Header({ title, arabicTitle }: HeaderProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // استرجاع إعدادات اللغة والسمة من التخزين المحلي
  // Get language and theme settings from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);
  
  // تبديل اللغة بين العربية والإنجليزية
  // Toggle language between Arabic and English
  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  };
  
  // تبديل السمة بين الفاتحة والداكنة
  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-center">
          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label={language === 'ar' ? "القائمة" : "Menu"}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mr-4 ml-4">
            {language === 'ar' ? arabicTitle : title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button 
            onClick={toggleLanguage}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label={language === 'ar' ? "تغيير اللغة" : "Change language"}
          >
            <Globe className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label={language === 'ar' ? "تغيير السمة" : "Toggle theme"}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          
          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            aria-label={language === 'ar' ? "الإشعارات" : "Notifications"}
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
