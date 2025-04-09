{/* 
  صفحة الإشعارات
  Notifications Page
  
  هذه الصفحة تعرض الإشعارات المتعلقة بالمزرعة وتتيح إدارتها
  This page displays farm-related notifications and allows managing them
*/}

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Bell, Check, Trash, Calendar, AlertTriangle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

// نموذج بيانات الإشعارات
// Notification data model
interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'vaccination' | 'feeding' | 'alert' | 'info';
  date: string;
  read: boolean;
  related_id?: string;
  related_type?: string;
}

export default function NotificationsPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات الإشعارات
    // Fetch notifications data
    fetchNotifications();
  }, []);
  
  // استرجاع بيانات الإشعارات من قاعدة البيانات
  // Fetch notifications from database
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleData: Notification[] = [
        {
          id: 1,
          title: 'Vaccination Due',
          message: 'Batch B2025001 is due for Newcastle vaccination tomorrow',
          type: 'vaccination',
          date: '2025-04-10T09:00:00Z',
          read: false,
          related_id: 'B2025001',
          related_type: 'batch'
        },
        {
          id: 2,
          title: 'Feed Stock Low',
          message: 'Feed stock is running low. Current stock: 500 kg',
          type: 'alert',
          date: '2025-04-09T14:30:00Z',
          read: false
        },
        {
          id: 3,
          title: 'Feeding Schedule',
          message: 'Batch B2025002 feeding schedule updated',
          type: 'feeding',
          date: '2025-04-08T16:45:00Z',
          read: true,
          related_id: 'B2025002',
          related_type: 'batch'
        },
        {
          id: 4,
          title: 'Sales Report',
          message: 'Monthly sales report for March 2025 is now available',
          type: 'info',
          date: '2025-04-05T10:15:00Z',
          read: true,
          related_id: 'march-2025',
          related_type: 'report'
        },
        {
          id: 5,
          title: 'Temperature Alert',
          message: 'High temperature detected in Barn 2. Current: 35°C',
          type: 'alert',
          date: '2025-04-09T13:20:00Z',
          read: false
        }
      ];
      
      setNotifications(sampleData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // تحديد أيقونة الإشعار حسب النوع
  // Determine notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'vaccination':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'feeding':
        return <Info className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // تعيين الإشعار كمقروء
  // Mark notification as read
  const handleMarkAsRead = async (id: number) => {
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // تحديث حالة الإشعار محلياً
      // Update notification state locally
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    }
  };
  
  // حذف الإشعار
  // Delete notification
  const handleDeleteNotification = async (id: number) => {
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // حذف الإشعار محلياً
      // Delete notification locally
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    }
  };
  
  // تعيين جميع الإشعارات كمقروءة
  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // تحديث حالة جميع الإشعارات محلياً
      // Update all notifications state locally
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    }
  };
  
  // التنقل إلى العنصر المرتبط بالإشعار
  // Navigate to notification related item
  const handleNavigateToRelated = (notification: Notification) => {
    if (!notification.related_id || !notification.related_type) {
      return;
    }
    
    switch (notification.related_type) {
      case 'batch':
        router.push(`/inventory/${notification.related_id}`);
        break;
      case 'report':
        router.push('/reports');
        break;
      default:
        break;
    }
    
    // تعيين الإشعار كمقروء بعد التنقل
    // Mark notification as read after navigation
    handleMarkAsRead(notification.id);
  };
  
  // عدد الإشعارات غير المقروءة
  // Count of unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Notifications" 
        arabicTitle="الإشعارات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            {language === 'ar' ? 'الإشعارات' : 'Notifications'}
            {unreadCount > 0 && (
              <span className="ml-2 rtl:mr-2 rtl:ml-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          {notifications.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              icon={<Check className="h-5 w-5" />}
            >
              {language === 'ar' ? 'تعيين الكل كمقروء' : 'Mark All as Read'}
            </Button>
          )}
        </div>
        
        <Card>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`py-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div 
                      className="flex-grow cursor-pointer"
                      onClick={() => handleNavigateToRelated(notification)}
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(notification.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2 rtl:space-x-reverse">
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title={language === 'ar' ? 'تعيين كمقروء' : 'Mark as read'}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
              </p>
            </div>
          )}
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
