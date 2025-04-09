{/* 
  صفحة إدارة الأدوية واللقاحات
  Medication Management Page
  
  هذه الصفحة تعرض قائمة سجلات الأدوية واللقاحات وتتيح إضافة وتعديل وحذف السجلات
  This page displays a list of medication and vaccination records and allows adding, editing, and deleting records
*/}

'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import { useRouter } from 'next/navigation';

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

export default function MedicationPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [medicationRecords, setMedicationRecords] = useState<MedicationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات الأدوية واللقاحات
    // Fetch medication data
    fetchMedicationRecords();
  }, []);
  
  // استرجاع بيانات الأدوية واللقاحات من قاعدة البيانات
  // Fetch medication records from database
  const fetchMedicationRecords = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleData: MedicationRecord[] = [
        {
          id: 1,
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
        },
        {
          id: 2,
          batch_id: 'B2025001',
          application_date: '2025-04-05',
          medication_type: 'Antibiotic',
          medication_name: 'Amoxicillin',
          dosage: '10mg/kg',
          application_method: 'Water',
          cost: 200,
          withdrawal_period_days: 7,
          notes: 'Preventive treatment',
          created_at: '2025-04-05T10:15:00Z'
        },
        {
          id: 3,
          batch_id: 'B2025002',
          application_date: '2025-04-06',
          medication_type: 'Vaccine',
          medication_name: 'Infectious Bronchitis Vaccine',
          dosage: '1 drop per bird',
          application_method: 'Eye drop',
          cost: 180,
          withdrawal_period_days: 0,
          next_due_date: '2025-04-20',
          notes: 'First vaccination for batch B2025002',
          created_at: '2025-04-06T08:45:00Z'
        }
      ];
      
      setMedicationRecords(sampleData);
    } catch (error) {
      console.error('Error fetching medication records:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // تعريف أعمدة الجدول
  // Define table columns
  const columns = [
    {
      key: 'batch_id',
      title: 'Batch ID',
      arabicTitle: 'معرف الدفعة'
    },
    {
      key: 'application_date',
      title: 'Application Date',
      arabicTitle: 'تاريخ التطبيق',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'medication_type',
      title: 'Type',
      arabicTitle: 'النوع',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Vaccine' 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {language === 'ar' 
            ? value === 'Vaccine' 
              ? 'لقاح' 
              : 'مضاد حيوي'
            : value}
        </span>
      )
    },
    {
      key: 'medication_name',
      title: 'Medication Name',
      arabicTitle: 'اسم الدواء'
    },
    {
      key: 'application_method',
      title: 'Method',
      arabicTitle: 'طريقة التطبيق'
    },
    {
      key: 'next_due_date',
      title: 'Next Due Date',
      arabicTitle: 'تاريخ الاستحقاق التالي',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];
  
  // التنقل إلى صفحة إضافة سجل دواء جديد
  // Navigate to add new medication record page
  const handleAddRecord = () => {
    router.push('/medication/add');
  };
  
  // عرض تفاصيل سجل الدواء
  // View medication record details
  const handleViewRecord = (record: MedicationRecord) => {
    router.push(`/medication/${record.id}`);
  };
  
  // تعديل سجل الدواء
  // Edit medication record
  const handleEditRecord = (record: MedicationRecord) => {
    router.push(`/medication/edit/${record.id}`);
  };
  
  // حذف سجل الدواء
  // Delete medication record
  const handleDeleteRecord = async (record: MedicationRecord) => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل ${record.medication_type === 'Vaccine' ? 'اللقاح' : 'الدواء'} للدفعة ${record.batch_id} بتاريخ ${new Date(record.application_date).toLocaleDateString()}؟` 
      : `Are you sure you want to delete ${record.medication_type.toLowerCase()} record for batch ${record.batch_id} on ${new Date(record.application_date).toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        setMedicationRecords(medicationRecords.filter(item => item.id !== record.id));
        // يمكن إضافة إشعار نجاح هنا
        // Can add success notification here
      } catch (error) {
        console.error('Error deleting medication record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Medication & Vaccination" 
        arabicTitle="الأدوية واللقاحات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'سجلات الأدوية واللقاحات' : 'Medication & Vaccination Records'}
          </h2>
          <Button 
            variant="primary" 
            onClick={handleAddRecord}
            icon={<Plus className="h-5 w-5" />}
          >
            {language === 'ar' ? 'إضافة سجل جديد' : 'Add New Record'}
          </Button>
        </div>
        
        <Card>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table 
              columns={columns}
              data={medicationRecords}
              onRowClick={handleViewRecord}
              actions={{
                view: true,
                edit: true,
                delete: true,
                onView: handleViewRecord,
                onEdit: handleEditRecord,
                onDelete: handleDeleteRecord
              }}
              searchable={true}
              pagination={true}
            />
          )}
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
