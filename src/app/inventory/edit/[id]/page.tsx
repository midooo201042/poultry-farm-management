{/* 
  صفحة تعديل الدفعة
  Edit Batch Page
  
  هذه الصفحة تتيح تعديل بيانات دفعة موجودة من الدواجن
  This page allows editing an existing poultry batch
*/}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Form from '@/components/ui/Form';
import InputField from '@/components/ui/InputField';
import Select from '@/components/ui/Select';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

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

export default function EditInventoryPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // نموذج البيانات
  // Form data
  const [formData, setFormData] = useState({
    batch_id: '',
    entry_date: '',
    initial_count: '',
    current_count: '',
    breed: '',
    source: '',
    status: '',
    notes: ''
  });
  
  // أخطاء التحقق
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // استرجاع بيانات الدفعة
    // Fetch batch data
    fetchBatchDetails();
  }, [params.id]);
  
  // استرجاع بيانات الدفعة من قاعدة البيانات
  // Fetch batch details from database
  const fetchBatchDetails = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleBatch: InventoryItem = {
        id: parseInt(params.id),
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
      };
      
      // تعيين بيانات النموذج
      // Set form data
      setFormData({
        batch_id: sampleBatch.batch_id,
        entry_date: sampleBatch.entry_date,
        initial_count: sampleBatch.initial_count.toString(),
        current_count: sampleBatch.current_count.toString(),
        breed: sampleBatch.breed,
        source: sampleBatch.source,
        status: sampleBatch.status,
        notes: sampleBatch.notes || ''
      });
    } catch (error) {
      console.error('Error fetching batch details:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoading(false);
    }
  };
  
  // تحديث بيانات النموذج
  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // مسح الخطأ عند تغيير القيمة
    // Clear error when value changes
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // التحقق من صحة البيانات
  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.batch_id) {
      newErrors.batch_id = language === 'ar' ? 'معرف الدفعة مطلوب' : 'Batch ID is required';
    }
    
    if (!formData.entry_date) {
      newErrors.entry_date = language === 'ar' ? 'تاريخ الإدخال مطلوب' : 'Entry date is required';
    }
    
    if (!formData.initial_count) {
      newErrors.initial_count = language === 'ar' ? 'العدد الأولي مطلوب' : 'Initial count is required';
    } else if (parseInt(formData.initial_count) <= 0) {
      newErrors.initial_count = language === 'ar' ? 'يجب أن يكون العدد الأولي أكبر من صفر' : 'Initial count must be greater than zero';
    }
    
    if (!formData.current_count) {
      newErrors.current_count = language === 'ar' ? 'العدد الحالي مطلوب' : 'Current count is required';
    } else if (parseInt(formData.current_count) < 0) {
      newErrors.current_count = language === 'ar' ? 'يجب أن يكون العدد الحالي أكبر من أو يساوي صفر' : 'Current count must be greater than or equal to zero';
    } else if (parseInt(formData.current_count) > parseInt(formData.initial_count)) {
      newErrors.current_count = language === 'ar' ? 'يجب أن يكون العدد الحالي أقل من أو يساوي العدد الأولي' : 'Current count must be less than or equal to initial count';
    }
    
    if (!formData.breed) {
      newErrors.breed = language === 'ar' ? 'السلالة مطلوبة' : 'Breed is required';
    }
    
    if (!formData.source) {
      newErrors.source = language === 'ar' ? 'المصدر مطلوب' : 'Source is required';
    }
    
    if (!formData.status) {
      newErrors.status = language === 'ar' ? 'الحالة مطلوبة' : 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // إرسال النموذج
  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      console.log('Form data submitted:', formData);
      
      // محاكاة تأخير الشبكة
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // التنقل إلى صفحة تفاصيل الدفعة بعد النجاح
      // Navigate to batch details page after success
      router.push(`/inventory/${params.id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // خيارات السلالات
  // Breed options
  const breedOptions = [
    { value: 'Cobb 500', label: 'Cobb 500', arabicLabel: 'كوب 500' },
    { value: 'Ross 308', label: 'Ross 308', arabicLabel: 'روس 308' },
    { value: 'Hubbard', label: 'Hubbard', arabicLabel: 'هابارد' },
    { value: 'Arbor Acres', label: 'Arbor Acres', arabicLabel: 'أربور إيكرز' }
  ];
  
  // خيارات الحالة
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active', arabicLabel: 'نشط' },
    { value: 'sold', label: 'Sold', arabicLabel: 'مباع' },
    { value: 'dead', label: 'Dead', arabicLabel: 'نافق' }
  ];
  
  // العودة إلى صفحة تفاصيل الدفعة
  // Return to batch details page
  const handleBack = () => {
    router.push(`/inventory/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Edit Batch" 
        arabicTitle="تعديل الدفعة" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى تفاصيل الدفعة' : 'Back to Batch Details'}
        </Button>
        
        <Card 
          title="Edit Batch" 
          arabicTitle="تعديل الدفعة"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Form 
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
              arabicSubmitLabel="حفظ التغييرات"
              cancelLabel="Cancel"
              arabicCancelLabel="إلغاء"
              onCancel={handleBack}
              isLoading={isSubmitting}
            >
              <InputField 
                id="batch_id"
                name="batch_id"
                label="Batch ID"
                arabicLabel="معرف الدفعة"
                placeholder="e.g. B2025001"
                arabicPlaceholder="مثال: B2025001"
                value={formData.batch_id}
                onChange={handleChange}
                required
                error={errors.batch_id}
                arabicError={errors.batch_id}
              />
              
              <InputField 
                id="entry_date"
                name="entry_date"
                label="Entry Date"
                arabicLabel="تاريخ الإدخال"
                type="date"
                value={formData.entry_date}
                onChange={handleChange}
                required
                error={errors.entry_date}
                arabicError={errors.entry_date}
              />
              
              <InputField 
                id="initial_count"
                name="initial_count"
                label="Initial Count"
                arabicLabel="العدد الأولي"
                type="number"
                placeholder="e.g. 5000"
                arabicPlaceholder="مثال: 5000"
                value={formData.initial_count}
                onChange={handleChange}
                required
                min={1}
                error={errors.initial_count}
                arabicError={errors.initial_count}
              />
              
              <InputField 
                id="current_count"
                name="current_count"
                label="Current Count"
                arabicLabel="العدد الحالي"
                type="number"
                placeholder="e.g. 4850"
                arabicPlaceholder="مثال: 4850"
                value={formData.current_count}
                onChange={handleChange}
                required
                min={0}
                error={errors.current_count}
                arabicError={errors.current_count}
              />
              
              <Select 
                id="breed"
                name="breed"
                label="Breed"
                arabicLabel="السلالة"
                options={breedOptions}
                value={formData.breed}
                onChange={handleChange}
                required
                error={errors.breed}
                arabicError={errors.breed}
              />
              
              <InputField 
                id="source"
                name="source"
                label="Source"
                arabicLabel="المصدر"
                placeholder="e.g. Local Hatchery"
                arabicPlaceholder="مثال: المفرخة المحلية"
                value={formData.source}
                onChange={handleChange}
                required
                error={errors.source}
                arabicError={errors.source}
              />
              
              <Select 
                id="status"
                name="status"
                label="Status"
                arabicLabel="الحالة"
                options={statusOptions}
                value={formData.status}
                onChange={handleChange}
                required
                error={errors.status}
                arabicError={errors.status}
              />
              
              <InputField 
                id="notes"
                name="notes"
                label="Notes"
                arabicLabel="ملاحظات"
                placeholder="Any additional information"
                arabicPlaceholder="أي معلومات إضافية"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form>
          )}
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
