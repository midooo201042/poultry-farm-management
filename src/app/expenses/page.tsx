{/* 
  صفحة إدارة المصروفات
  Expenses Management Page
  
  هذه الصفحة تعرض قائمة سجلات المصروفات وتتيح إضافة وتعديل وحذف السجلات
  This page displays a list of expense records and allows adding, editing, and deleting records
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

export default function ExpensesPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات المصروفات
    // Fetch expense data
    fetchExpenseRecords();
  }, []);
  
  // استرجاع بيانات المصروفات من قاعدة البيانات
  // Fetch expense records from database
  const fetchExpenseRecords = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleData: ExpenseRecord[] = [
        {
          id: 1,
          expense_date: '2025-04-01',
          expense_type: 'Feed',
          amount: 5000,
          payment_method: 'Bank Transfer',
          description: 'Monthly feed supply',
          vendor: 'Feed Supplier Co.',
          receipt_number: 'INV-2025-001',
          created_at: '2025-04-01T10:30:00Z'
        },
        {
          id: 2,
          expense_date: '2025-04-02',
          expense_type: 'Medication',
          amount: 1200,
          payment_method: 'Cash',
          description: 'Vaccines and antibiotics',
          vendor: 'Vet Supplies Ltd.',
          receipt_number: 'REC-458',
          created_at: '2025-04-02T14:15:00Z'
        },
        {
          id: 3,
          expense_date: '2025-04-03',
          expense_type: 'Utilities',
          amount: 800,
          payment_method: 'Bank Transfer',
          description: 'Electricity bill',
          vendor: 'Power Company',
          receipt_number: 'BILL-2025-04',
          created_at: '2025-04-03T09:45:00Z'
        },
        {
          id: 4,
          expense_date: '2025-04-05',
          expense_type: 'Labor',
          amount: 3000,
          payment_method: 'Bank Transfer',
          description: 'Staff salaries',
          vendor: '',
          receipt_number: '',
          created_at: '2025-04-05T16:20:00Z'
        },
        {
          id: 5,
          expense_date: '2025-04-07',
          expense_type: 'Equipment',
          amount: 1500,
          payment_method: 'Credit Card',
          description: 'New feeders and drinkers',
          vendor: 'Farm Equipment Store',
          receipt_number: 'INV-789',
          created_at: '2025-04-07T11:10:00Z'
        }
      ];
      
      setExpenseRecords(sampleData);
    } catch (error) {
      console.error('Error fetching expense records:', error);
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
      key: 'expense_date',
      title: 'Date',
      arabicTitle: 'التاريخ',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'expense_type',
      title: 'Type',
      arabicTitle: 'النوع',
      render: (value: string) => {
        const typeColors: Record<string, string> = {
          'Feed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          'Medication': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          'Utilities': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          'Labor': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          'Equipment': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
        };
        
        const arabicLabels: Record<string, string> = {
          'Feed': 'علف',
          'Medication': 'أدوية',
          'Utilities': 'مرافق',
          'Labor': 'عمالة',
          'Equipment': 'معدات'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
            {language === 'ar' ? arabicLabels[value] || value : value}
          </span>
        );
      }
    },
    {
      key: 'description',
      title: 'Description',
      arabicTitle: 'الوصف'
    },
    {
      key: 'amount',
      title: 'Amount',
      arabicTitle: 'المبلغ',
      render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      key: 'payment_method',
      title: 'Payment Method',
      arabicTitle: 'طريقة الدفع'
    },
    {
      key: 'vendor',
      title: 'Vendor',
      arabicTitle: 'المورد'
    }
  ];
  
  // إعداد بيانات الرسم البياني حسب النوع
  // Prepare chart data by type
  const prepareChartDataByType = () => {
    const expensesByType: Record<string, number> = {};
    
    expenseRecords.forEach(record => {
      if (expensesByType[record.expense_type]) {
        expensesByType[record.expense_type] += record.amount;
      } else {
        expensesByType[record.expense_type] = record.amount;
      }
    });
    
    return Object.entries(expensesByType).map(([type, amount]) => ({
      name: type,
      value: amount
    }));
  };
  
  // إعداد بيانات الرسم البياني حسب التاريخ
  // Prepare chart data by date
  const prepareChartDataByDate = () => {
    const sortedRecords = [...expenseRecords].sort((a, b) => 
      new Date(a.expense_date).getTime() - new Date(b.expense_date).getTime()
    );
    
    return sortedRecords.map(record => ({
      date: new Date(record.expense_date).toLocaleDateString(),
      amount: record.amount
    }));
  };
  
  // حساب إجمالي المصروفات
  // Calculate total expenses
  const totalExpenses = expenseRecords.reduce((sum, record) => sum + record.amount, 0);
  
  // التنقل إلى صفحة إضافة سجل مصروفات جديد
  // Navigate to add new expense record page
  const handleAddRecord = () => {
    router.push('/expenses/add');
  };
  
  // عرض تفاصيل سجل المصروفات
  // View expense record details
  const handleViewRecord = (record: ExpenseRecord) => {
    router.push(`/expenses/${record.id}`);
  };
  
  // تعديل سجل المصروفات
  // Edit expense record
  const handleEditRecord = (record: ExpenseRecord) => {
    router.push(`/expenses/edit/${record.id}`);
  };
  
  // حذف سجل المصروفات
  // Delete expense record
  const handleDeleteRecord = async (record: ExpenseRecord) => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل المصروفات "${record.description}" بتاريخ ${new Date(record.expense_date).toLocaleDateString()}؟` 
      : `Are you sure you want to delete expense record "${record.description}" on ${new Date(record.expense_date).toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        setExpenseRecords(expenseRecords.filter(item => item.id !== record.id));
        // يمكن إضافة إشعار نجاح هنا
        // Can add success notification here
      } catch (error) {
        console.error('Error deleting expense record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Expenses Management" 
        arabicTitle="إدارة المصروفات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'سجلات المصروفات' : 'Expense Records'}
          </h2>
          <Button 
            variant="primary" 
            onClick={handleAddRecord}
            icon={<Plus className="h-5 w-5" />}
          >
            {language === 'ar' ? 'إضافة سجل جديد' : 'Add New Record'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
              </h3>
              <p className="text-3xl font-bold text-primary">
                {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'المصروفات حسب النوع' : 'Expenses by Type'}
            </h3>
            {expenseRecords.length > 0 ? (
              <Chart 
                type="pie"
                data={prepareChartDataByType()}
                nameKey="name"
                dataKey="value"
                height={300}
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'لا توجد بيانات لعرضها' : 'No data to display'}
              </div>
            )}
          </Card>
          
          <Card>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {language === 'ar' ? 'المصروفات حسب التاريخ' : 'Expenses by Date'}
            </h3>
            {expenseRecords.length > 0 ? (
              <Chart 
                type="bar"
                data={prepareChartDataByDate()}
                xKey="date"
                yKeys={[
                  { key: 'amount', color: '#ef4444', name: 'Expenses', arabicName: 'المصروفات' }
                ]}
                xLabel="Date"
                arabicXLabel="التاريخ"
                yLabel="Amount"
                arabicYLabel="المبلغ"
                height={300}
              />
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'لا توجد بيانات لعرضها' : 'No data to display'}
              </div>
            )}
          </Card>
        </div>
        
        <Card>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table 
              columns={columns}
              data={expenseRecords}
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
