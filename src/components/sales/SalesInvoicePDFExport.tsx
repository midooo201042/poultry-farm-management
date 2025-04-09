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

// مكون تصدير فاتورة المبيعات كملف PDF
// Sales invoice PDF export component
export default function SalesInvoicePDFExport({ 
  salesRecord
}: { 
  salesRecord: any;
}) {
  // تعريف أعمدة الفاتورة
  // Define invoice columns
  const columns = [
    { key: 'item', title: 'Item', arabicTitle: 'البند' },
    { key: 'quantity', title: 'Quantity', arabicTitle: 'الكمية' },
    { key: 'unit_price', title: 'Unit Price', arabicTitle: 'سعر الوحدة' },
    { key: 'total', title: 'Total', arabicTitle: 'الإجمالي' }
  ];
  
  // تحويل البيانات لتناسب تنسيق PDF
  // Transform data to fit PDF format
  const formattedData = [
    {
      item: 'Broiler Chickens / دجاج لاحم',
      quantity: `${salesRecord.quantity.toLocaleString()} birds / طائر`,
      unit_price: `${(salesRecord.total_revenue / salesRecord.quantity).toFixed(2)} per bird / للطائر`,
      total: salesRecord.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      item: 'Total Weight / الوزن الإجمالي',
      quantity: `${salesRecord.weight_total.toLocaleString()} kg / كجم`,
      unit_price: `${salesRecord.price_per_kg.toFixed(2)} per kg / للكجم`,
      total: ''
    }
  ];
  
  // إضافة صف المجموع في نهاية البيانات
  // Add total row at the end of data
  const dataWithTotal = [
    ...formattedData,
    {
      item: '',
      quantity: '',
      unit_price: 'Total Amount / المبلغ الإجمالي',
      total: salesRecord.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  ];
  
  return (
    <PDFExport
      fileName={`sales_invoice_${salesRecord.batch_id}_${new Date(salesRecord.sale_date).toISOString().split('T')[0]}`}
      title={`Sales Invoice - Batch ${salesRecord.batch_id}`}
      arabicTitle={`فاتورة مبيعات - الدفعة ${salesRecord.batch_id}`}
      data={dataWithTotal}
      columns={columns}
      includeTimestamp={true}
      includeLogo={true}
      logoPath="/logo.png"
      buttonLabel="Export Invoice"
      arabicButtonLabel="تصدير الفاتورة"
      buttonVariant="outline"
    />
  );
}
