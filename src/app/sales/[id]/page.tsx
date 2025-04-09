{/* 
  صفحة تفاصيل سجل المبيعات
  Sales Record Details Page
  
  هذه الصفحة تعرض تفاصيل سجل مبيعات محدد
  This page displays details of a specific sales record
*/}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Edit, Trash, Printer, FileText } from 'lucide-react';

// نموذج بيانات المبيعات
// Sales data model
interface SalesRecord {
  id: number;
  batch_id: string;
  sale_date: string;
  quantity: number;
  weight_total: number;
  price_per_kg: number;
  total_revenue: number;
  customer_name?: string;
  payment_method?: string;
  payment_status: string;
  notes?: string;
  created_at: string;
}

export default function SalesRecordDetailsPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [record, setRecord] = useState<SalesRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات سجل المبيعات
    // Fetch sales record data
    fetchSalesRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل المبيعات من قاعدة البيانات
  // Fetch sales record from database
  const fetchSalesRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: SalesRecord = {
        id: parseInt(params.id),
        batch_id: 'B2025001',
        sale_date: '2025-04-08',
        quantity: 1000,
        weight_total: 2200,
        price_per_kg: 5.2,
        total_revenue: 11440,
        customer_name: 'Local Distributor',
        payment_method: 'Cash',
        payment_status: 'paid',
        notes: 'Partial batch sale',
        created_at: '2025-04-08T14:30:00Z'
      };
      
      setRecord(sampleRecord);
    } catch (error) {
      console.error('Error fetching sales record:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // العودة إلى صفحة المبيعات
  // Return to sales page
  const handleBack = () => {
    router.push('/sales');
  };
  
  // تعديل سجل المبيعات
  // Edit sales record
  const handleEdit = () => {
    router.push(`/sales/edit/${params.id}`);
  };
  
  // حذف سجل المبيعات
  // Delete sales record
  const handleDelete = async () => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل المبيعات للدفعة ${record?.batch_id} بتاريخ ${new Date(record?.sale_date || '').toLocaleDateString()}؟` 
      : `Are you sure you want to delete sales record for batch ${record?.batch_id} on ${new Date(record?.sale_date || '').toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        
        // التنقل إلى صفحة المبيعات بعد الحذف
        // Navigate to sales page after deletion
        router.push('/sales');
      } catch (error) {
        console.error('Error deleting sales record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };
  
  // طباعة فاتورة المبيعات
  // Print sales invoice
  const handlePrintInvoice = () => {
    // في الإصدار النهائي، سيتم استبدال هذا بوظيفة طباعة حقيقية
    // In the final version, this will be replaced with a real print function
    alert(language === 'ar' 
      ? 'سيتم طباعة الفاتورة...' 
      : 'Invoice will be printed...');
  };
  
  // تصدير فاتورة المبيعات كملف PDF
  // Export sales invoice as PDF
  const handleExportInvoice = () => {
    // في الإصدار النهائي، سيتم استبدال هذا بوظيفة تصدير PDF حقيقية
    // In the final version, this will be replaced with a real PDF export function
    alert(language === 'ar' 
      ? 'سيتم تصدير الفاتورة كملف PDF...' 
      : 'Invoice will be exported as PDF...');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Sales Record Details" 
        arabicTitle="تفاصيل سجل المبيعات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى سجلات المبيعات' : 'Back to Sales Records'}
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
                  {language === 'ar' ? 'سجل مبيعات للدفعة' : 'Sales Record for Batch'} {record.batch_id}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(record.sale_date).toLocaleDateString()}
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
                  {language === 'ar' ? 'معلومات المبيعات' : 'Sales Information'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الكمية' : 'Quantity'}:</span>
                    <span className="font-medium">{record.quantity.toLocaleString()} {language === 'ar' ? 'طائر' : 'birds'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الوزن الإجمالي' : 'Total Weight'}:</span>
                    <span className="font-medium">{record.weight_total.toLocaleString()} {language === 'ar' ? 'كجم' : 'kg'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'متوسط الوزن' : 'Average Weight'}:</span>
                    <span className="font-medium">{(record.weight_total / record.quantity).toFixed(2)} {language === 'ar' ? 'كجم/طائر' : 'kg/bird'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'السعر لكل كجم' : 'Price per kg'}:</span>
                    <span className="font-medium">{record.price_per_kg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الإيراد الإجمالي' : 'Total Revenue'}:</span>
                    <span className="font-medium text-primary text-lg">{record.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'معلومات الدفع' : 'Payment Information'}
                </h3>
                <div className="space-y-3">
                  {record.customer_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'اسم العميل' : 'Customer Name'}:</span>
                      <span className="font-medium">{record.customer_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
                    <span className="font-medium">{record.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'حالة الدفع' : 'Payment Status'}:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      record.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {language === 'ar' 
                        ? record.payment_status === 'paid' 
                          ? 'مدفوع' 
                          : 'معلق'
                        : record.payment_status === 'paid' 
                          ? 'Paid' 
                          : 'Pending'}
                    </span>
                  </div>
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
                  onClick={handlePrintInvoice}
                  icon={<Printer className="h-5 w-5" />}
                >
                  {language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportInvoice}
                  icon={<FileText className="h-5 w-5" />}
                >
                  {language === 'ar' ? 'تصدير كملف PDF' : 'Export as PDF'}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'لم يتم العثور على سجل المبيعات' : 'Sales record not found'}
              </p>
              <Button 
                variant="primary" 
                onClick={handleBack}
                className="mt-4"
              >
                {language === 'ar' ? 'العودة إلى سجلات المبيعات' : 'Back to Sales Records'}
              </Button>
            </div>
          </Card>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}
