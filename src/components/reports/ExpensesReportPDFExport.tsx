// تثبيت المكتبات اللازمة لتصدير ملفات PDF
// Install required libraries for PDF export

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import { FileText } from 'lucide-react';

// استيراد مكون تصدير PDF بشكل ديناميكي لتجنب أخطاء التنفيذ على الخادم
// Dynamically import PDF export component to avoid server-side execution errors
const PDFExport = dynamic(() => import('@/components/ui/PDFExport'), {
  ssr: false,
  loading: () => (
    <Button variant="primary" disabled>
      <span className="animate-pulse">جاري التحميل...</span>
    </Button>
  )
});

// مكون تصدير تقرير المصروفات كملف PDF
// Expenses report PDF export component
export default function ExpensesReportPDFExport({ 
  expenseData, 
  totalExpenses, 
  dateRange 
}: { 
  expenseData: any[]; 
  totalExpenses: number;
  dateRange: string;
}) {
  // تعريف أعمدة التقرير
  // Define report columns
  const columns = [
    { key: 'expense_date', title: 'Date', arabicTitle: 'التاريخ' },
    { key: 'expense_type', title: 'Type', arabicTitle: 'النوع' },
    { key: 'description', title: 'Description', arabicTitle: 'الوصف' },
    { key: 'amount', title: 'Amount', arabicTitle: 'المبلغ' },
    { key: 'payment_method', title: 'Payment Method', arabicTitle: 'طريقة الدفع' },
    { key: 'vendor', title: 'Vendor', arabicTitle: 'المورد' }
  ];
  
  // تحويل البيانات لتناسب تنسيق PDF
  // Transform data to fit PDF format
  const formattedData = expenseData.map(expense => ({
    ...expense,
    expense_date: new Date(expense.expense_date).toLocaleDateString(),
    amount: expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }));
  
  // إضافة صف المجموع في نهاية البيانات
  // Add total row at the end of data
  const dataWithTotal = [
    ...formattedData,
    {
      expense_date: '',
      expense_type: '',
      description: '',
      amount: totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      payment_method: 'الإجمالي / Total',
      vendor: ''
    }
  ];
  
  return (
    <PDFExport
      fileName={`expenses_report_${new Date().toISOString().split('T')[0]}`}
      title="Expenses Report"
      arabicTitle="تقرير المصروفات"
      data={dataWithTotal}
      columns={columns}
      includeTimestamp={true}
      includeLogo={true}
      logoPath="/logo.png"
      buttonLabel="Export Expenses Report"
      arabicButtonLabel="تصدير تقرير المصروفات"
    />
  );
}
