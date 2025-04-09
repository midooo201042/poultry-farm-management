{/* 
  صفحة إضافة دفعة جديدة
  Add New Batch Page
  
  هذه الصفحة تتيح إضافة دفعة جديدة من الدواجن إلى المخزون
  This page allows adding a new batch of poultry to the inventory
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

export default function AddInventoryPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // نموذج البيانات
  // Form data
  const [formData, setFormData] = useState({
    batch_id: '',
    entry_date: new Date().toISOString().split('T')[0],
    initial_count: '',
    breed: '',
    source: '',
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
  }, []);
  
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
    
    if (!formData.breed) {
      newErrors.breed = language === 'ar' ? 'السلالة مطلوبة' : 'Breed is required';
    }
    
    if (!formData.source) {
      newErrors.source = language === 'ar' ? 'المصدر مطلوب' : 'Source is required';
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
      
      // التنقل إلى صفحة المخزون بعد النجاح
      // Navigate to inventory page after success
      router.push('/inventory');
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
  
  // العودة إلى صفحة المخزون
  // Return to inventory page
  const handleBack = () => {
    router.push('/inventory');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Add New Batch" 
        arabicTitle="إضافة دفعة جديدة" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى المخزون' : 'Back to Inventory'}
        </Button>
        
        <Card 
          title="Add New Batch" 
          arabicTitle="إضافة دفعة جديدة"
        >
          <Form 
            onSubmit={handleSubmit}
            submitLabel="Add Batch"
            arabicSubmitLabel="إضافة الدفعة"
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
              placeholder="e.g. B2025004"
              arabicPlaceholder="مثال: B2025004"
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
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
