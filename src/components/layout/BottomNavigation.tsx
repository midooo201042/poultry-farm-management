{/* 
  شريط التنقل السفلي
  Bottom Navigation Bar Component
  
  هذا المكون يوفر شريط تنقل سفلي للتطبيق يتيح للمستخدم التنقل بين الأقسام المختلفة
  This component provides a bottom navigation bar for the application that allows users to navigate between different sections
*/}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// أيقونات للقائمة - Icons for the menu
import { 
  Home, 
  BarChart2, 
  Clipboard, 
  Users, 
  DollarSign,
  Feather,
  Droplet,
  Bell,
  Settings
} from 'lucide-react';

// واجهة لعناصر القائمة - Interface for menu items
interface NavItem {
  name: string;
  arabicName: string;
  href: string;
  icon: React.ElementType;
}

// عناصر القائمة - Navigation items
const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    arabicName: 'الرئيسية',
    href: '/',
    icon: Home
  },
  {
    name: 'Inventory',
    arabicName: 'المخزون',
    href: '/inventory',
    icon: Clipboard
  },
  {
    name: 'Growth',
    arabicName: 'النمو',
    href: '/growth',
    icon: BarChart2
  },
  {
    name: 'Feeding',
    arabicName: 'التغذية',
    href: '/feeding',
    icon: Feather
  },
  {
    name: 'Medication',
    arabicName: 'الأدوية',
    href: '/medication',
    href: '/medication',
    icon: Droplet
  },
  {
    name: 'Sales',
    arabicName: 'المبيعات',
    href: '/sales',
    icon: DollarSign
  },
  {
    name: 'Employees',
    arabicName: 'الموظفين',
    href: '/employees',
    icon: Users
  },
  {
    name: 'Notifications',
    arabicName: 'الإشعارات',
    href: '/notifications',
    icon: Bell
  },
  {
    name: 'Settings',
    arabicName: 'الإعدادات',
    href: '/settings',
    icon: Settings
  }
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar'); // الافتراضي هو العربية - Default is Arabic
  
  // استرجاع إعدادات اللغة من التخزين المحلي - Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // تحديد العنصر النشط - Determine active item
  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex overflow-x-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-1 min-w-[4rem] transition-colors ${
              isActive(item.href)
                ? 'text-primary bg-primary/10'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5'
            }`}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium truncate">
              {language === 'ar' ? item.arabicName : item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
