{/* 
  صفحة تفاصيل سجل الدواء أو اللقاح
  Medication Record Details Page
  
  هذه الصفحة تعرض تفاصيل سجل دواء أو لقاح محدد
  This page displays details of a specific medication or vaccination record
*/}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Edit, Trash, Calendar } from 'lucide-react';

// نموذج بيانات الأدوية واللقاحات
// Medication data model
interface MedicationRecord {
  id: number;
  batch_id: string;
  application_date: string;
  medication_type: string;
  medication_name: string;
  dosage: string;
  application_method: string;
  cost: number;
  withdrawal_period_days?: number;
  next_due_date?: string;
  notes?: string;
  created_at: string;
}

export default function MedicationRecordDetailsPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [record, setRecord] = useState<MedicationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات سجل الدواء
    // Fetch medication record data
    fetchMedicationRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل الدواء من قاعدة البيانات
  // Fetch medication record from database
  const fetchMedicationRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: MedicationRecord = {
        id: parseInt(params.id),
        batch_id: 'B2025001',
        application_date: '2025-04-02',
        medication_type: 'Vaccine',
        medication_name: 'Newcastle Disease Vaccine',
        dosage: '1 drop per bird',
        application_method: 'Eye drop',
        cost: 150,
        withdrawal_period_days: 0,
        next_due_date: '2025-04-16',
        notes: 'First vaccination',
        created_at: '2025-04-02T09:30:00Z'
      };
      
      setRecord(sampleRecord);
    } catch (error) {
      console.error('Error fetching medication record:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // العودة إلى صفحة الأدوية واللقاحات
  // Return to medication page
  const handleBack = () => {
    router.push('/medication');
  };
  
  // تعديل سجل الدواء
  // Edit medication record
  const handleEdit = () => {
    router.push(`/medication/edit/${params.id}`);
  };
  
  // حذف سجل الدواء
  // Delete medication record
  const handleDelete = async () => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل ${record?.medication_type === 'Vaccine' ? 'اللقاح' : 'الدواء'} للدفعة ${record?.batch_id} بتاريخ ${new Date(record?.application_date || '').toLocaleDateString()}؟` 
      : `Are you sure you want to delete ${record?.medication_type.toLowerCase()} record for batch ${record?.batch_id} on ${new Date(record?.application_date || '').toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        
        // التنقل إلى صفحة الأدوية واللقاحات بعد الحذف
        // Navigate to medication page after deletion
        router.push('/medication');
      } catch (error) {
        console.error('Error deleting medication record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };
  
  // إضافة إشعار للتذكير بالجرعة التالية
  // Add notification for next dose reminder
  const handleAddReminder = () => {
    if (record?.next_due_date) {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      alert(language === 'ar' 
        ? `تم إضافة تذكير للجرعة التالية في ${new Date(record.next_due_date).toLocaleDateString()}`
        : `Reminder added for next dose on ${new Date(record.next_due_date).toLocaleDateString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Medication Record Details" 
        arabicTitle="تفاصيل سجل الدواء/اللقاح" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى سجلات الأدوية واللقاحات' : 'Back to Medication Records'}
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
                  {record.medication_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? 'للدفعة' : 'For Batch'} {record.batch_id} - {new Date(record.application_date).toLocaleDateString()}
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
                  {language === 'ar' ? 'معلومات الدواء/اللقاح' : 'Medication Information'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'النوع' : 'Type'}:</span>
                    <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                      record.medication_type === 'Vaccine' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {language === 'ar' 
                        ? record.medication_type === 'Vaccine' 
                          ? 'لقاح' 
                          : 'مضاد حيوي'
                        : record.medication_type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الجرعة' : 'Dosage'}:</span>
                    <span className="font-medium">{record.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'طريقة التطبيق' : 'Application Method'}:</span>
                    <span className="font-medium">{record.application_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'التكلفة' : 'Cost'}:</span>
                    <span className="font-medium">{record.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  {record.withdrawal_period_days !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'فترة السحب' : 'Withdrawal Period'}:</span>
                      <span className="font-medium">{record.withdrawal_period_days} {language === 'ar' ? 'يوم' : 'days'}</span>
                    </div>
                  )}
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
                  {record.next_due_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'تاريخ الاستحقاق التالي' : 'Next Due Date'}:</span>
                      <span className="font-medium text-primary">{new Date(record.next_due_date).toLocaleDateString()}</span>
                    </div>
                  )}
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
                {record.next_due_date && (
                  <Button 
                    variant="outline" 
                    onClick={handleAddReminder}
                    icon={<Calendar className="h-5 w-5" />}
                  >
                    {language === 'ar' ? 'إضافة تذكير للجرعة التالية' : 'Add Reminder for Next Dose'}
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/medication/add?batch_id=${record.batch_id}`)}
                >
                  {language === 'ar' ? 'إضافة سجل دواء جديد لنفس الدفعة' : 'Add New Medication for Same Batch'}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'لم يتم العثور على سجل الدواء/اللقاح' : 'Medication record not found'}
              </p>
              <Button 
                variant="primary" 
                onClick={handleBack}
                className="mt-4"
              >
                {language === 'ar' ? 'العودة إلى سجلات الأدوية واللقاحات' : 'Back to Medication Records'}
              </Button>
            </div>
          </Card>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}
