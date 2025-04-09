{/* 
  صفحة إدارة التغذية
  Feeding Management Page
  
  هذه الصفحة تعرض قائمة سجلات التغذية وتتيح إضافة وتعديل وحذف السجلات
  This page displays a list of feeding records and allows adding, editing, and deleting records
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

// نموذج بيانات التغذية
// Feeding data model
interface FeedingRecord {
  id: number;
  batch_id: string;
  feed_date: string;
  feed_type: string;
  quantity: number;
  cost_per_kg: number;
  total_cost: number;
  feed_time?: string;
  notes?: string;
  created_at: string;
}

export default function FeedingPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [feedingRecords, setFeedingRecords] = useState<FeedingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات التغذية
    // Fetch feeding data
    fetchFeedingRecords();
  }, []);
  
  // استرجاع بيانات التغذية من قاعدة البيانات
  // Fetch feeding records from database
  const fetchFeedingRecords = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleData: FeedingRecord[] = [
        {
          id: 1,
          batch_id: 'B2025001',
          feed_date: '2025-04-01',
          feed_type: 'Starter Feed',
          quantity: 250,
          cost_per_kg: 1.2,
          total_cost: 300,
          feed_time: '08:00',
          notes: 'First feeding for new batch',
          created_at: '2025-04-01T08:30:00Z'
        },
        {
          id: 2,
          batch_id: 'B2025001',
          feed_date: '2025-04-02',
          feed_type: 'Starter Feed',
          quantity: 275,
          cost_per_kg: 1.2,
          total_cost: 330,
          feed_time: '08:00',
          notes: '',
          created_at: '2025-04-02T08:15:00Z'
        },
        {
          id: 3,
          batch_id: 'B2025002',
          feed_date: '2025-04-05',
          feed_type: 'Starter Feed',
          quantity: 350,
          cost_per_kg: 1.2,
          total_cost: 420,
          feed_time: '08:30',
          notes: 'First feeding for batch B2025002',
          created_at: '2025-04-05T09:00:00Z'
        },
        {
          id: 4,
          batch_id: 'B2025001',
          feed_date: '2025-04-08',
          feed_type: 'Grower Feed',
          quantity: 400,
          cost_per_kg: 1.15,
          total_cost: 460,
          feed_time: '08:00',
          notes: 'Switched to grower feed',
          created_at: '2025-04-08T08:20:00Z'
        }
      ];
      
      setFeedingRecords(sampleData);
    } catch (error) {
      console.error('Error fetching feeding records:', error);
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
      key: 'feed_date',
      title: 'Feed Date',
      arabicTitle: 'تاريخ التغذية',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'feed_type',
      title: 'Feed Type',
      arabicTitle: 'نوع العلف'
    },
    {
      key: 'quantity',
      title: 'Quantity (kg)',
      arabicTitle: 'الكمية (كجم)',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'cost_per_kg',
      title: 'Cost/kg',
      arabicTitle: 'التكلفة/كجم',
      render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    {
      key: 'total_cost',
      title: 'Total Cost',
      arabicTitle: 'التكلفة الإجمالية',
      render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  ];
  
  // التنقل إلى صفحة إضافة سجل تغذية جديد
  // Navigate to add new feeding record page
  const handleAddRecord = () => {
    router.push('/feeding/add');
  };
  
  // عرض تفاصيل سجل التغذية
  // View feeding record details
  const handleViewRecord = (record: FeedingRecord) => {
    router.push(`/feeding/${record.id}`);
  };
  
  // تعديل سجل التغذية
  // Edit feeding record
  const handleEditRecord = (record: FeedingRecord) => {
    router.push(`/feeding/edit/${record.id}`);
  };
  
  // حذف سجل التغذية
  // Delete feeding record
  const handleDeleteRecord = async (record: FeedingRecord) => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف سجل التغذية للدفعة ${record.batch_id} بتاريخ ${new Date(record.feed_date).toLocaleDateString()}؟` 
      : `Are you sure you want to delete feeding record for batch ${record.batch_id} on ${new Date(record.feed_date).toLocaleDateString()}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        setFeedingRecords(feedingRecords.filter(item => item.id !== record.id));
        // يمكن إضافة إشعار نجاح هنا
        // Can add success notification here
      } catch (error) {
        console.error('Error deleting feeding record:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Feeding Management" 
        arabicTitle="إدارة التغذية" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'سجلات التغذية' : 'Feeding Records'}
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
              data={feedingRecords}
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
