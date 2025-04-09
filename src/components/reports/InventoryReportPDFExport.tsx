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

// مكون تصدير تقرير المخزون كملف PDF
// Inventory report PDF export component
export default function InventoryReportPDFExport({ 
  batchData,
  totalBirds,
  totalSold
}: { 
  batchData: any[]; 
  totalBirds: number;
  totalSold: number;
}) {
  // تعريف أعمدة التقرير
  // Define report columns
  const columns = [
    { key: 'batch_id', title: 'Batch ID', arabicTitle: 'معرف الدفعة' },
    { key: 'arrival_date', title: 'Arrival Date', arabicTitle: 'تاريخ الوصول' },
    { key: 'breed', title: 'Breed', arabicTitle: 'السلالة' },
    { key: 'initial_count', title: 'Initial Count', arabicTitle: 'العدد الأولي' },
    { key: 'current_count', title: 'Current Count', arabicTitle: 'العدد الحالي' },
    { key: 'mortality', title: 'Mortality', arabicTitle: 'النفوق' },
    { key: 'status', title: 'Status', arabicTitle: 'الحالة' }
  ];
  
  // تحويل البيانات لتناسب تنسيق PDF
  // Transform data to fit PDF format
  const formattedData = batchData.map(batch => ({
    ...batch,
    arrival_date: new Date(batch.arrival_date).toLocaleDateString(),
    initial_count: batch.initial_count.toLocaleString(),
    current_count: batch.current_count.toLocaleString(),
    mortality: (batch.initial_count - batch.current_count - (batch.status === 'sold' ? batch.initial_count : 0)).toLocaleString(),
    status: batch.status === 'active' ? 'Active / نشط' : batch.status === 'sold' ? 'Sold / مباع' : batch.status
  }));
  
  // إضافة صف المجموع في نهاية البيانات
  // Add total row at the end of data
  const dataWithTotal = [
    ...formattedData,
    {
      batch_id: 'Total / الإجمالي',
      arrival_date: '',
      breed: '',
      initial_count: batchData.reduce((sum, batch) => sum + batch.initial_count, 0).toLocaleString(),
      current_count: totalBirds.toLocaleString(),
      mortality: batchData.reduce((sum, batch) => sum + (batch.initial_count - batch.current_count - (batch.status === 'sold' ? batch.initial_count : 0)), 0).toLocaleString(),
      status: ''
    }
  ];
  
  return (
    <PDFExport
      fileName={`inventory_report_${new Date().toISOString().split('T')[0]}`}
      title="Inventory Report"
      arabicTitle="تقرير المخزون"
      data={dataWithTotal}
      columns={columns}
      includeTimestamp={true}
      includeLogo={true}
      logoPath="/logo.png"
      orientation="landscape"
      buttonLabel="Export Inventory Report"
      arabicButtonLabel="تصدير تقرير المخزون"
    />
  );
}
