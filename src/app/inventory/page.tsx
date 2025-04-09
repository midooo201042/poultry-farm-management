{/* 
  صفحة إدارة المخزون
  Inventory Management Page
  
  هذه الصفحة تعرض قائمة دفعات الدواجن وتتيح إضافة وتعديل وحذف الدفعات
  This page displays a list of poultry batches and allows adding, editing, and deleting batches
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

export default function InventoryPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات المخزون
    // Fetch inventory data
    fetchInventory();
  }, []);
  
  // استرجاع بيانات المخزون من قاعدة البيانات
  // Fetch inventory data from database
  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleData: InventoryItem[] = [
        {
          id: 1,
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
        },
        {
          id: 2,
          batch_id: 'B2025002',
          entry_date: '2025-04-05',
          initial_count: 7500,
          current_count: 7450,
          breed: 'Ross 308',
          source: 'Premium Poultry Inc.',
          status: 'active',
          notes: 'Premium quality chicks',
          created_at: '2025-04-05T09:15:00Z',
          updated_at: '2025-04-09T11:20:00Z'
        },
        {
          id: 3,
          batch_id: 'B2025003',
          entry_date: '2025-03-15',
          initial_count: 6000,
          current_count: 0,
          breed: 'Cobb 500',
          source: 'Local Hatchery',
          status: 'sold',
          notes: 'Sold to Market A',
          created_at: '2025-03-15T08:30:00Z',
          updated_at: '2025-04-05T16:45:00Z'
        }
      ];
      
      setInventory(sampleData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
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
      key: 'entry_date',
      title: 'Entry Date',
      arabicTitle: 'تاريخ الإدخال',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'breed',
      title: 'Breed',
      arabicTitle: 'السلالة'
    },
    {
      key: 'initial_count',
      title: 'Initial Count',
      arabicTitle: 'العدد الأولي',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'current_count',
      title: 'Current Count',
      arabicTitle: 'العدد الحالي',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'status',
      title: 'Status',
      arabicTitle: 'الحالة',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : value === 'sold' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {language === 'ar' 
            ? value === 'active' 
              ? 'نشط' 
              : value === 'sold' 
                ? 'مباع' 
                : 'نافق'
            : value}
        </span>
      )
    }
  ];
  
  // التنقل إلى صفحة إضافة دفعة جديدة
  // Navigate to add new batch page
  const handleAddBatch = () => {
    router.push('/inventory/add');
  };
  
  // عرض تفاصيل الدفعة
  // View batch details
  const handleViewBatch = (batch: InventoryItem) => {
    router.push(`/inventory/${batch.id}`);
  };
  
  // تعديل الدفعة
  // Edit batch
  const handleEditBatch = (batch: InventoryItem) => {
    router.push(`/inventory/edit/${batch.id}`);
  };
  
  // حذف الدفعة
  // Delete batch
  const handleDeleteBatch = async (batch: InventoryItem) => {
    if (confirm(language === 'ar' 
      ? `هل أنت متأكد من حذف الدفعة ${batch.batch_id}؟` 
      : `Are you sure you want to delete batch ${batch.batch_id}?`)) {
      try {
        // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
        // In the final version, this will be replaced with a real API request
        setInventory(inventory.filter(item => item.id !== batch.id));
        // يمكن إضافة إشعار نجاح هنا
        // Can add success notification here
      } catch (error) {
        console.error('Error deleting batch:', error);
        // يمكن إضافة إشعار خطأ هنا
        // Can add error notification here
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Inventory Management" 
        arabicTitle="إدارة المخزون" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {language === 'ar' ? 'دفعات الدواجن' : 'Poultry Batches'}
          </h2>
          <Button 
            variant="primary" 
            onClick={handleAddBatch}
            icon={<Plus className="h-5 w-5" />}
          >
            {language === 'ar' ? 'إضافة دفعة جديدة' : 'Add New Batch'}
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
              data={inventory}
              onRowClick={handleViewBatch}
              actions={{
                view: true,
                edit: true,
                delete: true,
                onView: handleViewBatch,
                onEdit: handleEditBatch,
                onDelete: handleDeleteBatch
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
