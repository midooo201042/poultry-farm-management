{/* 
  صفحة إدارة المبيعات والإيرادات
  Sales and Revenue Management Page
  
  هذه الصفحة تعرض قائمة سجلات المبيعات وتتيح إضافة وتعديل وحذف السجلات
  This page displays a list of sales records and allows adding, editing, and deleting records
*/}

'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Chart from '@/components/ui/Chart';
import { useRouter } from 'next/navigation';

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

export default function SalesPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [salesRecords, setSalesRecords] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات المبيعات
    // Fetch sales data
    fetchSalesRecords();
  }, []);
  
  // استرجاع بيانات المبيعات من قاعدة البيانات
  // Fetch sales records from database
  const fetchSalesRecords = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleData: SalesRecord[] = [
        {
          id: 1,
          batch_id: 'B2025003',
          sale_date: '2025-04-05',
          quantity: 6000,
          weight_total: 12000,
          price_per_kg: 5.5,
          total_revenue: 66000,
          customer_name: 'Market A',
          payment_method: 'Bank Transfer',
          payment_status: 'paid',
          notes: 'Complete batch sale',
          created_at: '2025-04-05T16:45:00Z'
        },
        {
          id: 2,
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
        },
        {
          id: 3,
          batch_id: 'B2025002',
          sale_date: '2025-04-09',
          quantity: 2000,
          weight_total: 4400,
          price_per_kg: 5.3,
          total_revenue: 23320,
          customer_name: 'Restaurant Chain',
          payment_method: 'Check',
          payment_status: 'pending',
          notes: 'Partial batch sale, payment due in 7 days',
          created_at: '2025-04-09T10:15:00Z'
        }
      ];
      
      setSalesRecords(sampleData);
    } catch (error) {
      console.error('Error fetching sales records:', error);
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
      key: 'sale_date',
      title: 'Sale Date',
      arabicTitle: 'تاريخ البيع',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'quantity',
      title: 'Quantity',
      arabicTitle: 'الكمية',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'weight_total',
      title: 'Total Weight (kg)',
      arabicTitle: 'الوزن الإجمالي (كجم)',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'price_per_kg',
      title: 'Price/kg',
      arabicTitle: 'السعر/كجم',
      render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      key: 'total_revenue',
      title: 'Total Revenue',
      arabicTitle: 'الإيراد الإجمالي',
      render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      key: 'payment_status',
      title: 'Payment Status',
      arabicTitle: 'حالة الدفع',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'paid' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}>
          {language === 'ar' 
            ? value === 'paid' 
              ? 'مدفوع' 
              : 'معلق'
            : value === 'paid' 
              ? 'Paid' 
              : 'Pending'}
        </span>
      )
    }
  ];
  
  // إعداد بيانات الرسم البياني
  // Prepare chart data
  const chartData = salesRecords.map(record => ({
    date: new Date(record.sale_date).toLocaleDateString(),
    revenue: record.total_revenue,
    weight: record.weight_total
  }));
  
  // حساب إجمالي الإيرادات
  // Calculate total revenue
  const totalRevenue = salesRecords.reduce((sum, record) => sum + record.total_revenue, 0);
  
  // حساب إجمالي الوزن المباع
  // Calculate total weight sold
  const totalWeight = salesRecords.reduce((sum, record) => sum + record.weight_total, 0);
  
  // حساب إجمالي الكمية المباعة
  // Calculate total quantity sold
  const totalQuantity = salesRecords.reduce((sum, record) => sum + record.quantity, 0);
  
  // التنقل إلى صفحة إضافة سجل مبيعات جديد
  // Navigate to add new sales record page
  const handleAddRecord = () => {
    router.push('/sales/add');
  };
  
  // عرض تفاصيل سجل المبيعات
  // View sales record details
  const handleViewRecord = (record: SalesRecord) => {
    router.push(`/sales/${record.id}`);
  };
  
  // تعديل سجل المبيعات
  // Edit sales record
  const handleEditRecord = (record: SalesRecord) => {
    router.push(`/sales/edit/${record.id}`);
  };
  
  // حذف سجل المبيعات
  // Delete sales record
  const handleDeleteRecord = async (record: SalesRecord) => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل المبيعات للدفعة ${record.batch_id} بتاريخ ${new Date(record.sale_date).toLocaleDateString()}؟` 
      : `Are you sure you want to delete sales record for batch ${record.batch_id} on ${new Date(record.sale_date).toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        setSalesRecords(salesRecords.filter(item => item.id !== record.id));
        // يمكن إضافة إشعار نجاح هنا
        // Can add success notification here
      } catch (error) {
        console.error('Error deleting sales record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Sales Management" 
        arabicTitle="إدارة المبيعات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'سجلات المبيعات' : 'Sales Records'}
          </h2>
          <Button 
            variant="primary" 
            onClick={handleAddRecord}
            icon={<Plus className="h-5 w-5" />}
          >
            {language === 'ar' ? 'إضافة سجل جديد' : 'Add New Record'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
              </h3>
              <p className="text-3xl font-bold text-primary">
                {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'ar' ? 'إجمالي الوزن المباع' : 'Total Weight Sold'}
              </h3>
              <p className="text-3xl font-bold text-primary">
                {totalWeight.toLocaleString()} {language === 'ar' ? 'كجم' : 'kg'}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'ar' ? 'إجمالي الكمية المباعة' : 'Total Quantity Sold'}
              </h3>
              <p className="text-3xl font-bold text-primary">
                {totalQuantity.toLocaleString()} {language === 'ar' ? 'طائر' : 'birds'}
              </p>
            </div>
          </Card>
        </div>
        
        <Card className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'مخطط الإيرادات' : 'Revenue Chart'}
          </h3>
          {chartData.length > 0 ? (
            <Chart 
              type="bar"
              data={chartData}
              xKey="date"
              yKeys={[
                { key: 'revenue', color: '#3b82f6', name: 'Revenue', arabicName: 'الإيرادات' }
              ]}
              xLabel="Date"
              arabicXLabel="التاريخ"
              yLabel="Revenue"
              arabicYLabel="الإيرادات"
              height={300}
            />
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {language === 'ar' ? 'لا توجد بيانات لعرضها' : 'No data to display'}
            </div>
          )}
        </Card>
        
        <Card>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table 
              columns={columns}
              data={salesRecords}
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
