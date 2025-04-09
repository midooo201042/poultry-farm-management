{/* 
  صفحة التقارير والإحصائيات
  Reports and Analytics Page
  
  هذه الصفحة تعرض تقارير وإحصائيات شاملة عن المزرعة
  This page displays comprehensive reports and analytics about the farm
*/}

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Chart from '@/components/ui/Chart';
import Select from '@/components/ui/Select';
import { FileText, Calendar } from 'lucide-react';
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
}

// نموذج بيانات المصروفات
// Expense data model
interface ExpenseRecord {
  id: number;
  expense_date: string;
  expense_type: string;
  amount: number;
}

// نموذج بيانات الدفعات
// Batch data model
interface BatchRecord {
  batch_id: string;
  arrival_date: string;
  initial_count: number;
  current_count: number;
  breed: string;
  status: string;
}

export default function ReportsPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('financial');
  const router = useRouter();
  
  // بيانات المبيعات
  // Sales data
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  
  // بيانات المصروفات
  // Expense data
  const [expenseData, setExpenseData] = useState<ExpenseRecord[]>([]);
  
  // بيانات الدفعات
  // Batch data
  const [batchData, setBatchData] = useState<BatchRecord[]>([]);
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع البيانات
    // Fetch data
    fetchData();
  }, [timeRange]);
  
  // استرجاع البيانات من قاعدة البيانات
  // Fetch data from database
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للمبيعات
      // Sample sales data
      const sampleSalesData: SalesRecord[] = [
        {
          id: 1,
          batch_id: 'B2025003',
          sale_date: '2025-04-05',
          quantity: 6000,
          weight_total: 12000,
          price_per_kg: 5.5,
          total_revenue: 66000
        },
        {
          id: 2,
          batch_id: 'B2025001',
          sale_date: '2025-04-08',
          quantity: 1000,
          weight_total: 2200,
          price_per_kg: 5.2,
          total_revenue: 11440
        },
        {
          id: 3,
          batch_id: 'B2025002',
          sale_date: '2025-04-09',
          quantity: 2000,
          weight_total: 4400,
          price_per_kg: 5.3,
          total_revenue: 23320
        }
      ];
      
      // بيانات تجريبية للمصروفات
      // Sample expense data
      const sampleExpenseData: ExpenseRecord[] = [
        {
          id: 1,
          expense_date: '2025-04-01',
          expense_type: 'Feed',
          amount: 5000
        },
        {
          id: 2,
          expense_date: '2025-04-02',
          expense_type: 'Medication',
          amount: 1200
        },
        {
          id: 3,
          expense_date: '2025-04-03',
          expense_type: 'Utilities',
          amount: 800
        },
        {
          id: 4,
          expense_date: '2025-04-05',
          expense_type: 'Labor',
          amount: 3000
        },
        {
          id: 5,
          expense_date: '2025-04-07',
          expense_type: 'Equipment',
          amount: 1500
        }
      ];
      
      // بيانات تجريبية للدفعات
      // Sample batch data
      const sampleBatchData: BatchRecord[] = [
        {
          batch_id: 'B2025001',
          arrival_date: '2025-03-01',
          initial_count: 5000,
          current_count: 3850,
          breed: 'Cobb 500',
          status: 'active'
        },
        {
          batch_id: 'B2025002',
          arrival_date: '2025-03-15',
          initial_count: 7500,
          current_count: 5450,
          breed: 'Ross 308',
          status: 'active'
        },
        {
          batch_id: 'B2025003',
          arrival_date: '2025-02-10',
          initial_count: 6000,
          current_count: 0,
          breed: 'Cobb 500',
          status: 'sold'
        }
      ];
      
      setSalesData(sampleSalesData);
      setExpenseData(sampleExpenseData);
      setBatchData(sampleBatchData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // حساب إجمالي الإيرادات
  // Calculate total revenue
  const totalRevenue = salesData.reduce((sum, record) => sum + record.total_revenue, 0);
  
  // حساب إجمالي المصروفات
  // Calculate total expenses
  const totalExpenses = expenseData.reduce((sum, record) => sum + record.amount, 0);
  
  // حساب صافي الربح
  // Calculate net profit
  const netProfit = totalRevenue - totalExpenses;
  
  // حساب هامش الربح
  // Calculate profit margin
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  // إعداد بيانات الرسم البياني للإيرادات والمصروفات
  // Prepare chart data for revenue and expenses
  const prepareFinancialChartData = () => {
    // تجميع البيانات حسب التاريخ
    // Aggregate data by date
    const dateMap: Record<string, { revenue: number, expenses: number }> = {};
    
    salesData.forEach(record => {
      const date = new Date(record.sale_date).toLocaleDateString();
      if (dateMap[date]) {
        dateMap[date].revenue += record.total_revenue;
      } else {
        dateMap[date] = { revenue: record.total_revenue, expenses: 0 };
      }
    });
    
    expenseData.forEach(record => {
      const date = new Date(record.expense_date).toLocaleDateString();
      if (dateMap[date]) {
        dateMap[date].expenses += record.amount;
      } else {
        dateMap[date] = { revenue: 0, expenses: record.amount };
      }
    });
    
    // تحويل البيانات إلى مصفوفة
    // Convert data to array
    return Object.entries(dateMap).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.revenue - data.expenses
    }));
  };
  
  // إعداد بيانات الرسم البياني للمصروفات حسب النوع
  // Prepare chart data for expenses by type
  const prepareExpensesByTypeChartData = () => {
    const expensesByType: Record<string, number> = {};
    
    expenseData.forEach(record => {
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
  
  // إعداد بيانات الرسم البياني للدفعات
  // Prepare chart data for batches
  const prepareBatchChartData = () => {
    return batchData.map(batch => ({
      name: batch.batch_id,
      initial: batch.initial_count,
      current: batch.current_count,
      sold: batch.initial_count - batch.current_count
    }));
  };
  
  // خيارات النطاق الزمني
  // Time range options
  const timeRangeOptions = [
    { value: 'week', label: 'Last Week', arabicLabel: 'الأسبوع الماضي' },
    { value: 'month', label: 'Last Month', arabicLabel: 'الشهر الماضي' },
    { value: 'quarter', label: 'Last Quarter', arabicLabel: 'الربع الماضي' },
    { value: 'year', label: 'Last Year', arabicLabel: 'السنة الماضية' },
    { value: 'all', label: 'All Time', arabicLabel: 'كل الوقت' }
  ];
  
  // خيارات نوع التقرير
  // Report type options
  const reportTypeOptions = [
    { value: 'financial', label: 'Financial Report', arabicLabel: 'التقرير المالي' },
    { value: 'inventory', label: 'Inventory Report', arabicLabel: 'تقرير المخزون' },
    { value: 'performance', label: 'Performance Report', arabicLabel: 'تقرير الأداء' }
  ];
  
  // تصدير التقرير كملف PDF
  // Export report as PDF
  const handleExportReport = () => {
    // في الإصدار النهائي، سيتم استبدال هذا بوظيفة تصدير PDF حقيقية
    // In the final version, this will be replaced with a real PDF export function
    alert(language === 'ar' 
      ? `سيتم تصدير ${reportType === 'financial' ? 'التقرير المالي' : reportType === 'inventory' ? 'تقرير المخزون' : 'تقرير الأداء'} كملف PDF...` 
      : `${reportType === 'financial' ? 'Financial report' : reportType === 'inventory' ? 'Inventory report' : 'Performance report'} will be exported as PDF...`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Reports & Analytics" 
        arabicTitle="التقارير والإحصائيات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'لوحة التحكم والتقارير' : 'Dashboard & Reports'}
          </h2>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select 
                id="timeRange"
                name="timeRange"
                label=""
                arabicLabel=""
                options={timeRangeOptions}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select 
                id="reportType"
                name="reportType"
                label=""
                arabicLabel=""
                options={reportTypeOptions}
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              />
            </div>
            <Button 
              variant="primary" 
              onClick={handleExportReport}
              icon={<FileText className="h-5 w-5" />}
            >
              {language === 'ar' ? 'تصدير التقرير' : 'Export Report'}
            </Button>
          </div>
        </div>
        
        {reportType === 'financial' && (
          <>
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
                    {language === 'ar' ? 'إجمالي المصروفات' : 'Total Expenses'}
                  </h3>
                  <p className="text-3xl font-bold text-red-500">
                    {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'ar' ? 'صافي الربح' : 'Net Profit'}
                  </h3>
                  <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-sm ml-1">
                      ({profitMargin.toFixed(1)}%)
                    </span>
                  </p>
                </div>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'الإيرادات والمصروفات' : 'Revenue & Expenses'}
                </h3>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Chart 
                    type="bar"
                    data={prepareFinancialChartData()}
                    xKey="date"
                    yKeys={[
                      { key: 'revenue', color: '#3b82f6', name: 'Revenue', arabicName: 'الإيرادات' },
                      { key: 'expenses', color: '#ef4444', name: 'Expenses', arabicName: 'المصروفات' }
                    ]}
                    xLabel="Date"
                    arabicXLabel="التاريخ"
                    yLabel="Amount"
                    arabicYLabel="المبلغ"
                    height={300}
                  />
                )}
              </Card>
              
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'المصروفات حسب النوع' : 'Expenses by Type'}
                </h3>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Chart 
                    type="pie"
                    data={prepareExpensesByTypeChartData()}
                    nameKey="name"
                    dataKey="value"
                    height={300}
                  />
                )}
              </Card>
            </div>
            
            <Card>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'صافي الربح' : 'Net Profit'}
              </h3>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Chart 
                  type="line"
                  data={prepareFinancialChartData()}
                  xKey="date"
                  yKeys={[
                    { key: 'profit', color: '#10b981', name: 'Profit', arabicName: 'الربح' }
                  ]}
                  xLabel="Date"
                  arabicXLabel="التاريخ"
                  yLabel="Amount"
                  arabicYLabel="المبلغ"
                  height={300}
                />
              )}
            </Card>
          </>
        )}
        
        {reportType === 'inventory' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'ar' ? 'إجمالي الدفعات' : 'Total Batches'}
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {batchData.length}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'ar' ? 'إجمالي الطيور الحالية' : 'Current Birds'}
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {batchData.reduce((sum, batch) => sum + batch.current_count, 0).toLocaleString()}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'ar' ? 'إجمالي الطيور المباعة' : 'Total Birds Sold'}
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {batchData.reduce((sum, batch) => sum + (batch.initial_count - batch.current_count), 0).toLocaleString()}
                  </p>
                </div>
              </Card>
            </div>
            
            <Card className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'حالة الدفعات' : 'Batch Status'}
              </h3>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Chart 
                  type="bar"
                  data={prepareBatchChartData()}
                  xKey="name"
                  yKeys={[
                    { key: 'initial', color: '#3b82f6', name: 'Initial Count', arabicName: 'العدد الأولي' },
                    { key: 'current', color: '#10b981', name: 'Current Count', arabicName: 'العدد الحالي' },
                    { key: 'sold', color: '#f59e0b', name: 'Sold', arabicName: 'المباع' }
                  ]}
                  xLabel="Batch"
                  arabicXLabel="الدفعة"
                  yLabel="Count"
                  arabicYLabel="العدد"
                  height={300}
                />
              )}
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'توزيع السلالات' : 'Breed Distribution'}
                </h3>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Chart 
                    type="pie"
                    data={batchData.map(batch => ({
                      name: batch.breed,
                      value: batch.current_count
                    }))}
                    nameKey="name"
                    dataKey="value"
                    height={300}
                  />
                )}
              </Card>
              
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'معدل النفوق' : 'Mortality Rate'}
                </h3>
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <p className="text-5xl font-bold text-primary mb-2">
                    {((batchData.reduce((sum, batch) => sum + (batch.initial_count - batch.current_count - (batch.status === 'sold' ? batch.initial_count : 0)), 0) / 
                      Math.max(1, batchData.reduce((sum, batch) => sum + batch.initial_count, 0))) * 100).toFixed(1)}%
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'معدل النفوق الإجمالي' : 'Overall mortality rate'}
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
        
        {reportType === 'performance' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'ar' ? 'متوسط وزن البيع' : 'Avg. Sale Weight'}
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {(salesData.reduce((sum, sale) => sum + sale.weight_total, 0) / 
                      Math.max(1, salesData.reduce((sum, sale) => sum + sale.quantity, 0))).toFixed(2)} kg
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'ar' ? 'متوسط سعر البيع' : 'Avg. Sale Price'}
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {(salesData.reduce((sum, sale) => sum + (sale.price_per_kg * sale.weight_total), 0) / 
                      Math.max(1, salesData.reduce((sum, sale) => sum + sale.quantity, 0))).toFixed(2)} / bird
                  </p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {language === 'ar' ? 'تكلفة التغذية لكل طائر' : 'Feed Cost per Bird'}
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {(expenseData.filter(exp => exp.expense_type === 'Feed').reduce((sum, exp) => sum + exp.amount, 0) / 
                      Math.max(1, batchData.reduce((sum, batch) => sum + batch.initial_count, 0))).toFixed(2)}
                  </p>
                </div>
              </Card>
            </div>
            
            <Card className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {language === 'ar' ? 'الربح لكل طائر' : 'Profit per Bird'}
              </h3>
              <div className="flex flex-col items-center justify-center h-[300px]">
                <p className="text-5xl font-bold text-primary mb-2">
                  {(netProfit / Math.max(1, salesData.reduce((sum, sale) => sum + sale.quantity, 0))).toFixed(2)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? 'متوسط الربح لكل طائر' : 'Average profit per bird'}
                </p>
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'تكلفة الإنتاج' : 'Production Cost'}
                </h3>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <Chart 
                    type="pie"
                    data={prepareExpensesByTypeChartData()}
                    nameKey="name"
                    dataKey="value"
                    height={300}
                  />
                )}
              </Card>
              
              <Card>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {language === 'ar' ? 'معدل تحويل العلف' : 'Feed Conversion Ratio'}
                </h3>
                <div className="flex flex-col items-center justify-center h-[300px]">
                  <p className="text-5xl font-bold text-primary mb-2">
                    1.85
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {language === 'ar' ? 'كجم علف / كجم وزن' : 'kg feed / kg weight'}
                  </p>
                </div>
              </Card>
            </div>
          </>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}
