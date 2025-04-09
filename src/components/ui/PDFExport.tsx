{/* 
  مكون تصدير PDF
  PDF Export Component
  
  هذا المكون يوفر وظائف تصدير التقارير والمستندات كملفات PDF
  This component provides functionality to export reports and documents as PDF files
*/}

'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FileText, Download } from 'lucide-react';
import Button from './Button';

// تعريف خصائص المكون
// Component props definition
interface PDFExportProps {
  fileName?: string;
  title?: string;
  arabicTitle?: string;
  data: any[];
  columns: {
    key: string;
    title: string;
    arabicTitle: string;
  }[];
  renderHeader?: () => JSX.Element;
  renderFooter?: () => JSX.Element;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'a4' | 'a3' | 'letter';
  includeTimestamp?: boolean;
  includeLogo?: boolean;
  logoPath?: string;
  buttonLabel?: string;
  arabicButtonLabel?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

const PDFExport: React.FC<PDFExportProps> = ({
  fileName = 'export',
  title,
  arabicTitle,
  data,
  columns,
  renderHeader,
  renderFooter,
  orientation = 'portrait',
  pageSize = 'a4',
  includeTimestamp = true,
  includeLogo = false,
  logoPath,
  buttonLabel,
  arabicButtonLabel,
  buttonVariant = 'primary'
}) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);
  
  // تصدير البيانات كملف PDF
  // Export data as PDF file
  const exportToPDF = async () => {
    try {
      // إنشاء مستند PDF جديد
      // Create new PDF document
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize
      });
      
      // إضافة دعم للغة العربية
      // Add Arabic language support
      doc.addFont('/fonts/NotoSansArabic-Regular.ttf', 'NotoSansArabic', 'normal');
      doc.addFont('/fonts/NotoSansArabic-Bold.ttf', 'NotoSansArabic', 'bold');
      
      // تعيين الخط حسب اللغة
      // Set font based on language
      if (language === 'ar') {
        doc.setFont('NotoSansArabic');
        doc.setR2L(true);
      } else {
        doc.setFont('helvetica');
        doc.setR2L(false);
      }
      
      // إضافة الشعار إذا كان مطلوباً
      // Add logo if required
      if (includeLogo && logoPath) {
        try {
          doc.addImage(logoPath, 'PNG', 10, 10, 30, 30);
        } catch (error) {
          console.error('Error adding logo to PDF:', error);
        }
      }
      
      // إضافة العنوان
      // Add title
      const displayTitle = language === 'ar' ? arabicTitle || title : title || arabicTitle;
      if (displayTitle) {
        doc.setFontSize(18);
        doc.setFont(language === 'ar' ? 'NotoSansArabic' : 'helvetica', 'bold');
        doc.text(displayTitle, orientation === 'portrait' ? 105 : 150, includeLogo ? 25 : 15, { align: 'center' });
        doc.setFont(language === 'ar' ? 'NotoSansArabic' : 'helvetica', 'normal');
      }
      
      // إضافة الطابع الزمني
      // Add timestamp
      if (includeTimestamp) {
        doc.setFontSize(10);
        const timestamp = new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
        const timestampText = language === 'ar' ? `تاريخ التصدير: ${timestamp}` : `Export Date: ${timestamp}`;
        doc.text(timestampText, orientation === 'portrait' ? 105 : 150, includeLogo ? 35 : 25, { align: 'center' });
      }
      
      // تحضير بيانات الجدول
      // Prepare table data
      const tableColumns = columns.map(column => ({
        header: language === 'ar' ? column.arabicTitle : column.title,
        dataKey: column.key
      }));
      
      const tableData = data.map(item => {
        const row: Record<string, any> = {};
        columns.forEach(column => {
          row[column.key] = item[column.key];
        });
        return row;
      });
      
      // إضافة الجدول
      // Add table
      (doc as any).autoTable({
        columns: tableColumns,
        body: tableData,
        startY: includeLogo || includeTimestamp ? 45 : 30,
        styles: {
          font: language === 'ar' ? 'NotoSansArabic' : 'helvetica',
          fontSize: 10
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        margin: { top: 10 }
      });
      
      // إضافة معلومات التذييل
      // Add footer information
      doc.setFontSize(10);
      const footerText = language === 'ar' 
        ? 'تم إنشاؤه بواسطة نظام إدارة مزرعة الدواجن' 
        : 'Generated by Poultry Farm Management System';
      doc.text(
        footerText, 
        orientation === 'portrait' ? 105 : 150, 
        doc.internal.pageSize.height - 10, 
        { align: 'center' }
      );
      
      // حفظ الملف
      // Save file
      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'ar' 
        ? 'حدث خطأ أثناء إنشاء ملف PDF' 
        : 'An error occurred while creating the PDF file');
    }
  };

  return (
    <Button
      variant={buttonVariant}
      onClick={exportToPDF}
      icon={<FileText className="h-5 w-5" />}
    >
      {language === 'ar' 
        ? arabicButtonLabel || 'تصدير كملف PDF' 
        : buttonLabel || 'Export as PDF'}
    </Button>
  );
};

export default PDFExport;
