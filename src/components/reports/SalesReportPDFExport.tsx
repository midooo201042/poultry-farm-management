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

// مكون تصدير تقرير المبيعات كملف PDF
// Sales report PDF export component
export default function SalesReportPDFExport({ 
  salesData, 
  totalRevenue, 
  dateRange 
}: { 
  salesData: any[]; 
  totalRevenue: number;
  dateRange: string;
}) {
  // تعريف أعمدة التقرير
  // Define report columns
  const columns = [
    { key: 'batch_id', title: 'Batch ID', arabicTitle: 'معرف الدفعة' },
    { key: 'sale_date', title: 'Sale Date', arabicTitle: 'تاريخ البيع' },
    { key: 'quantity', title: 'Quantity', arabicTitle: 'الكمية' },
    { key: 'weight_total', title: 'Total Weight (kg)', arabicTitle: 'الوزن الإجمالي (كجم)' },
    { key: 'price_per_kg', title: 'Price/kg', arabicTitle: 'السعر/كجم' },
    { key: 'total_revenue', title: 'Revenue', arabicTitle: 'الإيراد' }
  ];
  
  // تحويل البيانات لتناسب تنسيق PDF
  // Transform data to fit PDF format
  const formattedData = salesData.map(sale => ({
    ...sale,
    sale_date: new Date(sale.sale_date).toLocaleDateString(),
    quantity: sale.quantity.toLocaleString(),
    weight_total: sale.weight_total.toLocaleString(),
    price_per_kg: sale.price_per_kg.toFixed(2),
    total_revenue: sale.total_revenue.toLocaleString()
  }));
  
  // إضافة صف المجموع في نهاية البيانات
  // Add total row at the end of data
  const dataWithTotal = [
    ...formattedData,
    {
      batch_id: '',
      sale_date: '',
      quantity: '',
      weight_total: '',
      price_per_kg: 'الإجمالي / Total',
      total_revenue: totalRevenue.toLocaleString()
    }
  ];
  
  return (
    <PDFExport
      fileName={`sales_report_${new Date().toISOString().split('T')[0]}`}
      title="Sales Report"
      arabicTitle="تقرير المبيعات"
      data={dataWithTotal}
      columns={columns}
      includeTimestamp={true}
      includeLogo={true}
      logoPath="/logo.png"
      buttonLabel="Export Sales Report"
      arabicButtonLabel="تصدير تقرير المبيعات"
    />
  );
}
