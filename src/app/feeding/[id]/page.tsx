{/* 
  صفحة تفاصيل سجل التغذية
  Feeding Record Details Page
  
  هذه الصفحة تعرض تفاصيل سجل تغذية محدد
  This page displays details of a specific feeding record
*/}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Edit, Trash } from 'lucide-react';

// نموذج بيانات التغذية
// Feeding data model
interface FeedingRecord {
  id: number;
  batch_id: string;
  feed_date: string;
  feed_type: string;
  quantity: number;
  cost_per_kg: number;
  total_cost: number;
  feed_time?: string;
  notes?: string;
  created_at: string;
}

export default function FeedingRecordDetailsPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [record, setRecord] = useState<FeedingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات سجل التغذية
    // Fetch feeding record data
    fetchFeedingRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل التغذية من قاعدة البيانات
  // Fetch feeding record from database
  const fetchFeedingRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: FeedingRecord = {
        id: parseInt(params.id),
        batch_id: 'B2025001',
        feed_date: '2025-04-08',
        feed_type: 'Grower Feed',
        quantity: 400,
        cost_per_kg: 1.15,
        total_cost: 460,
        feed_time: '08:00',
        notes: 'Switched to grower feed',
        created_at: '2025-04-08T08:20:00Z'
      };
      
      setRecord(sampleRecord);
    } catch (error) {
      console.error('Error fetching feeding record:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // العودة إلى صفحة التغذية
  // Return to feeding page
  const handleBack = () => {
    router.push('/feeding');
  };
  
  // تعديل سجل التغذية
  // Edit feeding record
  const handleEdit = () => {
    router.push(`/feeding/edit/${params.id}`);
  };
  
  // حذف سجل التغذية
  // Delete feeding record
  const handleDelete = async () => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل التغذية للدفعة ${record?.batch_id} بتاريخ ${new Date(record?.feed_date || '').toLocaleDateString()}؟` 
      : `Are you sure you want to delete feeding record for batch ${record?.batch_id} on ${new Date(record?.feed_date || '').toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        
        // التنقل إلى صفحة التغذية بعد الحذف
        // Navigate to feeding page after deletion
        router.push('/feeding');
      } catch (error) {
        console.error('Error deleting feeding record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Feeding Record Details" 
        arabicTitle="تفاصيل سجل التغذية" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى سجلات التغذية' : 'Back to Feeding Records'}
        </Button>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : record ? (
          <Card>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {language === 'ar' ? 'سجل تغذية للدفعة' : 'Feeding Record for Batch'} {record.batch_id}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(record.feed_date).toLocaleDateString()}
                  {record.feed_time && ` - ${record.feed_time}`}
                </p>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button 
                  variant="primary" 
                  onClick={handleEdit}
                  icon={<Edit className="h-5 w-5" />}
                >
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDelete}
                  icon={<Trash className="h-5 w-5" />}
                >
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'معلومات التغذية' : 'Feeding Information'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'نوع العلف' : 'Feed Type'}:</span>
                    <span className="font-medium">{record.feed_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الكمية' : 'Quantity'}:</span>
                    <span className="font-medium">{record.quantity.toLocaleString()} {language === 'ar' ? 'كجم' : 'kg'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'التكلفة لكل كجم' : 'Cost per kg'}:</span>
                    <span className="font-medium">{record.cost_per_kg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost'}:</span>
                    <span className="font-medium">{record.total_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}:</span>
                    <span className="font-medium">{new Date(record.created_at).toLocaleString()}</span>
                  </div>
                  {record.notes && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400 block mb-1">{language === 'ar' ? 'ملاحظات' : 'Notes'}:</span>
                      <p className="text-gray-800 dark:text-gray-200">{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'إجراءات ذات صلة' : 'Related Actions'}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/inventory/${record.batch_id}`)}
                >
                  {language === 'ar' ? 'عرض تفاصيل الدفعة' : 'View Batch Details'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/feeding/add?batch_id=${record.batch_id}`)}
                >
                  {language === 'ar' ? 'إضافة سجل تغذية جديد لنفس الدفعة' : 'Add New Feeding Record for Same Batch'}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'لم يتم العثور على سجل التغذية' : 'Feeding record not found'}
              </p>
              <Button 
                variant="primary" 
                onClick={handleBack}
                className="mt-4"
              >
                {language === 'ar' ? 'العودة إلى سجلات التغذية' : 'Back to Feeding Records'}
              </Button>
            </div>
          </Card>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}
