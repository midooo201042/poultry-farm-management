{/* 
  صفحة تفاصيل الدفعة
  Batch Details Page
  
  هذه الصفحة تعرض تفاصيل دفعة محددة من الدواجن
  This page displays details of a specific poultry batch
*/}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Chart from '@/components/ui/Chart';
import { ArrowLeft, Edit, Trash, FileText } from 'lucide-react';

// نموذج بيانات المخزون
// Inventory data model
interface InventoryItem {
  id: number;
  batch_id: string;
  entry_date: string;
  initial_count: number;
  current_count: number;
  breed: string;
  source: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// نموذج بيانات الوزن
// Weight data model
interface WeightRecord {
  id: number;
  batch_id: string;
  record_date: string;
  age_days: number;
  average_weight: number;
  weight_gain: number;
}

export default function BatchDetailsPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [batch, setBatch] = useState<InventoryItem | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات الدفعة
    // Fetch batch data
    fetchBatchDetails();
  }, [params.id]);
  
  // استرجاع بيانات الدفعة من قاعدة البيانات
  // Fetch batch details from database
  const fetchBatchDetails = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleBatch: InventoryItem = {
        id: parseInt(params.id),
        batch_id: 'B2025001',
        entry_date: '2025-04-01',
        initial_count: 5000,
        current_count: 4850,
        breed: 'Cobb 500',
        source: 'Local Hatchery',
        status: 'active',
        notes: 'First batch of the year',
        created_at: '2025-04-01T08:00:00Z',
        updated_at: '2025-04-09T10:30:00Z'
      };
      
      // بيانات الوزن التجريبية
      // Sample weight data
      const sampleWeightRecords: WeightRecord[] = [
        {
          id: 1,
          batch_id: 'B2025001',
          record_date: '2025-04-08',
          age_days: 7,
          average_weight: 170,
          weight_gain: 170
        },
        {
          id: 2,
          batch_id: 'B2025001',
          record_date: '2025-04-15',
          age_days: 14,
          average_weight: 450,
          weight_gain: 280
        },
        {
          id: 3,
          batch_id: 'B2025001',
          record_date: '2025-04-22',
          age_days: 21,
          average_weight: 850,
          weight_gain: 400
        },
        {
          id: 4,
          batch_id: 'B2025001',
          record_date: '2025-04-29',
          age_days: 28,
          average_weight: 1350,
          weight_gain: 500
        }
      ];
      
      setBatch(sampleBatch);
      setWeightRecords(sampleWeightRecords);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // العودة إلى صفحة المخزون
  // Return to inventory page
  const handleBack = () => {
    router.push('/inventory');
  };
  
  // تعديل الدفعة
  // Edit batch
  const handleEdit = () => {
    router.push(`/inventory/edit/${params.id}`);
  };
  
  // حذف الدفعة
  // Delete batch
  const handleDelete = async () => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف الدفعة ${batch?.batch_id}؟` 
      : `Are you sure you want to delete batch ${batch?.batch_id}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        
        // التنقل إلى صفحة المخزون بعد الحذف
        // Navigate to inventory page after deletion
        router.push('/inventory');
      } catch (error) {
        console.error('Error deleting batch:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };
  
  // تصدير التقرير
  // Export report
  const handleExportReport = () => {
    // في الإصدار النهائي، سيتم تنفيذ وظيفة تصدير PDF
    // In the final version, PDF export functionality will be implemented
    alert(language === 'ar' 
      ? 'سيتم تنفيذ وظيفة تصدير PDF في الإصدار النهائي' 
      : 'PDF export functionality will be implemented in the final version');
  };
  
  // تحويل بيانات الوزن لتنسيق الرسم البياني
  // Transform weight data for chart format
  const chartData = weightRecords.map(record => ({
    age: record.age_days,
    weight: record.average_weight,
    gain: record.weight_gain
  }));

  // حساب معدل النفوق
  // Calculate mortality rate
  const mortalityRate = batch 
    ? ((batch.initial_count - batch.current_count) / batch.initial_count * 100).toFixed(2)
    : '0.00';

  // حساب عمر الدفعة بالأيام
  // Calculate batch age in days
  const calculateAge = () => {
    if (!batch) return 0;
    const entryDate = new Date(batch.entry_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entryDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const batchAge = calculateAge();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Batch Details" 
        arabicTitle="تفاصيل الدفعة" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى المخزون' : 'Back to Inventory'}
        </Button>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : batch ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="md:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {batch.batch_id}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {language === 'ar' ? 'تم إدخاله في' : 'Entered on'} {new Date(batch.entry_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button 
                      variant="outline" 
                      onClick={handleExportReport}
                      icon={<FileText className="h-5 w-5" />}
                    >
                      {language === 'ar' ? 'تصدير' : 'Export'}
                    </Button>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {language === 'ar' ? 'معلومات الدفعة' : 'Batch Information'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'السلالة' : 'Breed'}:</span>
                        <span className="font-medium">{batch.breed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'المصدر' : 'Source'}:</span>
                        <span className="font-medium">{batch.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'العمر الحالي' : 'Current Age'}:</span>
                        <span className="font-medium">{batchAge} {language === 'ar' ? 'يوم' : 'days'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الحالة' : 'Status'}:</span>
                        <span className={`font-medium ${
                          batch.status === 'active' 
                            ? 'text-green-600 dark:text-green-400' 
                            : batch.status === 'sold' 
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-red-600 dark:text-red-400'
                        }`}>
                          {language === 'ar' 
                            ? batch.status === 'active' 
                              ? 'نشط' 
                              : batch.status === 'sold' 
                                ? 'مباع' 
                                : 'نافق'
                            : batch.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {language === 'ar' ? 'إحصائيات' : 'Statistics'}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'العدد الأولي' : 'Initial Count'}:</span>
                        <span className="font-medium">{batch.initial_count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'العدد الحالي' : 'Current Count'}:</span>
                        <span className="font-medium">{batch.current_count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'النفوق' : 'Mortality'}:</span>
                        <span className="font-medium">{(batch.initial_count - batch.current_count).toLocaleString()} ({mortalityRate}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'آخر تحديث' : 'Last Updated'}:</span>
                        <span className="font-medium">{new Date(batch.updated_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {batch.notes && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {language === 'ar' ? 'ملاحظات' : 'Notes'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{batch.notes}</p>
                  </div>
                )}
              </Card>
              
              <Card 
                title="Quick Actions" 
                arabicTitle="إجراءات سريعة"
              >
                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => router.push(`/growth/add?batch_id=${batch.batch_id}`)}
                  >
                    {language === 'ar' ? 'إضافة سجل وزن' : 'Add Weight Record'}
                  </Button>
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => router.push(`/feeding/add?batch_id=${batch.batch_id}`)}
                  >
                    {language === 'ar' ? 'إضافة سجل تغذية' : 'Add Feeding Record'}
                  </Button>
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => router.push(`/medication/add?batch_id=${batch.batch_id}`)}
                  >
                    {language === 'ar' ? 'إضافة سجل دواء' : 'Add Medication Record'}
                  </Button>
                  <Button 
                    variant="primary" 
                    fullWidth
                    onClick={() => router.push(`/sales/add?batch_id=${batch.batch_id}`)}
                  >
                    {language === 'ar' ? 'تسجيل مبيعات' : 'Record Sales'}
                  </Button>
                </div>
              </Card>
            </div>
            
            <Card 
              title="Growth Chart" 
              arabicTitle="مخطط النمو"
              className="mb-6"
            >
              <Chart 
                type="line"
                data={chartData}
                xKey="age"
                yKeys={[
                  { key: 'weight', color: '#3b82f6', name: 'Weight (g)', arabicName: 'الوزن (جم)' },
                  { key: 'gain', color: '#10b981', name: 'Weight Gain', arabicName: 'زيادة الوزن' }
                ]}
                xLabel="Age (days)"
                arabicXLabel="العمر (أيام)"
                yLabel="Weight (g)"
                arabicYLabel="الوزن (جم)"
                height={300}
              />
            </Card>
          </>
        ) : (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {language === 'ar' ? 'لم يتم العثور على الدفعة' : 'Batch not found'}
              </p>
              <Button 
                variant="primary" 
                onClick={handleBack}
                className="mt-4"
              >
                {language === 'ar' ? 'العودة إلى المخزون' : 'Back to Inventory'}
              </Button>
            </div>
          </Card>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}
