{/* 
  صفحة تفاصيل سجل المصروفات
  Expense Record Details Page
  
  هذه الصفحة تعرض تفاصيل سجل مصروفات محدد
  This page displays details of a specific expense record
*/}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Edit, Trash, Printer, FileText } from 'lucide-react';

// نموذج بيانات المصروفات
// Expense data model
interface ExpenseRecord {
  id: number;
  expense_date: string;
  expense_type: string;
  amount: number;
  payment_method: string;
  description?: string;
  vendor?: string;
  receipt_number?: string;
  created_at: string;
}

export default function ExpenseRecordDetailsPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [record, setRecord] = useState<ExpenseRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات سجل المصروفات
    // Fetch expense record data
    fetchExpenseRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل المصروفات من قاعدة البيانات
  // Fetch expense record from database
  const fetchExpenseRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: ExpenseRecord = {
        id: parseInt(params.id),
        expense_date: '2025-04-01',
        expense_type: 'Feed',
        amount: 5000,
        payment_method: 'Bank Transfer',
        description: 'Monthly feed supply',
        vendor: 'Feed Supplier Co.',
        receipt_number: 'INV-2025-001',
        created_at: '2025-04-01T10:30:00Z'
      };
      
      setRecord(sampleRecord);
    } catch (error) {
      console.error('Error fetching expense record:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // العودة إلى صفحة المصروفات
  // Return to expenses page
  const handleBack = () => {
    router.push('/expenses');
  };
  
  // تعديل سجل المصروفات
  // Edit expense record
  const handleEdit = () => {
    router.push(`/expenses/edit/${params.id}`);
  };
  
  // حذف سجل المصروفات
  // Delete expense record
  const handleDelete = async () => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل المصروفات "${record?.description}" بتاريخ ${new Date(record?.expense_date || '').toLocaleDateString()}؟` 
      : `Are you sure you want to delete expense record "${record?.description}" on ${new Date(record?.expense_date || '').toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        
        // التنقل إلى صفحة المصروفات بعد الحذف
        // Navigate to expenses page after deletion
        router.push('/expenses');
      } catch (error) {
        console.error('Error deleting expense record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };
  
  // طباعة إيصال المصروفات
  // Print expense receipt
  const handlePrintReceipt = () => {
    // في الإصدار النهائي، سيتم استبدال هذا بوظيفة طباعة حقيقية
    // In the final version, this will be replaced with a real print function
    alert(language === 'ar' 
      ? 'سيتم طباعة الإيصال...' 
      : 'Receipt will be printed...');
  };
  
  // تصدير إيصال المصروفات كملف PDF
  // Export expense receipt as PDF
  const handleExportReceipt = () => {
    // في الإصدار النهائي، سيتم استبدال هذا بوظيفة تصدير PDF حقيقية
    // In the final version, this will be replaced with a real PDF export function
    alert(language === 'ar' 
      ? 'سيتم تصدير الإيصال كملف PDF...' 
      : 'Receipt will be exported as PDF...');
  };

  // ترجمة نوع المصروف إلى العربية
  // Translate expense type to Arabic
  const getArabicExpenseType = (type: string) => {
    const arabicLabels: Record<string, string> = {
      'Feed': 'علف',
      'Medication': 'أدوية',
      'Utilities': 'مرافق',
      'Labor': 'عمالة',
      'Equipment': 'معدات',
      'Maintenance': 'صيانة',
      'Other': 'أخرى'
    };
    
    return arabicLabels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Expense Record Details" 
        arabicTitle="تفاصيل سجل المصروفات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى سجلات المصروفات' : 'Back to Expense Records'}
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
                  {record.description}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(record.expense_date).toLocaleDateString()}
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
                  {language === 'ar' ? 'معلومات المصروف' : 'Expense Information'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'النوع' : 'Type'}:</span>
                    <span className="font-medium">
                      {language === 'ar' ? getArabicExpenseType(record.expense_type) : record.expense_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'المبلغ' : 'Amount'}:</span>
                    <span className="font-medium text-primary text-lg">
                      {record.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}:</span>
                    <span className="font-medium">{record.payment_method}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
                </h3>
                <div className="space-y-3">
                  {record.vendor && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'المورد' : 'Vendor'}:</span>
                      <span className="font-medium">{record.vendor}</span>
                    </div>
                  )}
                  {record.receipt_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'رقم الإيصال' : 'Receipt Number'}:</span>
                      <span className="font-medium">{record.receipt_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}:</span>
                    <span className="font-medium">{new Date(record.created_at).toLocaleString()}</span>
                  </div>
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
                  onClick={handlePrintReceipt}
                  icon={<Printer className="h-5 w-5" />}
                >
                  {language === 'ar' ? 'طباعة الإيصال' : 'Print Receipt'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportReceipt}
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
                {language === 'ar' ? 'لم يتم العثور على سجل المصروفات' : 'Expense record not found'}
              </p>
              <Button 
                variant="primary" 
                onClick={handleBack}
                className="mt-4"
              >
                {language === 'ar' ? 'العودة إلى سجلات المصروفات' : 'Back to Expense Records'}
              </Button>
            </div>
          </Card>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}
