{/* 
  صفحة إضافة سجل تغذية جديد
  Add New Feeding Record Page
  
  هذه الصفحة تتيح إضافة سجل تغذية جديد
  This page allows adding a new feeding record
*/}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Card from '@/components/ui/Card';
import Form from '@/components/ui/Form';
import InputField from '@/components/ui/InputField';
import Select from '@/components/ui/Select';
import { ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

// نموذج بيانات الدفعات
// Batch data model for dropdown
interface BatchOption {
  batch_id: string;
  breed: string;
  current_count: number;
}

export default function AddFeedingRecordPage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // نموذج البيانات
  // Form data
  const [formData, setFormData] = useState({
    batch_id: searchParams.get('batch_id') || '',
    feed_date: new Date().toISOString().split('T')[0],
    feed_type: '',
    quantity: '',
    cost_per_kg: '',
    feed_time: '',
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
    
    // استرجاع قائمة الدفعات النشطة
    // Fetch active batches
    fetchActiveBatches();
  }, []);
  
  // استرجاع قائمة الدفعات النشطة
  // Fetch active batches
  const fetchActiveBatches = async () => {
    setIsLoadingBatches(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleBatches: BatchOption[] = [
        {
          batch_id: 'B2025001',
          breed: 'Cobb 500',
          current_count: 4850
        },
        {
          batch_id: 'B2025002',
          breed: 'Ross 308',
          current_count: 7450
        }
      ];
      
      setBatches(sampleBatches);
    } catch (error) {
      console.error('Error fetching batches:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsLoadingBatches(false);
    }
  };
  
  // تحديث بيانات النموذج
  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // حساب التكلفة الإجمالية عند تغيير الكمية أو التكلفة لكل كجم
    // Calculate total cost when quantity or cost per kg changes
    if (name === 'quantity' || name === 'cost_per_kg') {
      const quantity = name === 'quantity' ? parseFloat(value) : parseFloat(formData.quantity);
      const costPerKg = name === 'cost_per_kg' ? parseFloat(value) : parseFloat(formData.cost_per_kg);
      
      if (!isNaN(quantity) && !isNaN(costPerKg)) {
        const totalCost = quantity * costPerKg;
        console.log(`Total cost calculated: ${totalCost}`);
      }
    }
    
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
    
    if (!formData.feed_date) {
      newErrors.feed_date = language === 'ar' ? 'تاريخ التغذية مطلوب' : 'Feed date is required';
    }
    
    if (!formData.feed_type) {
      newErrors.feed_type = language === 'ar' ? 'نوع العلف مطلوب' : 'Feed type is required';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = language === 'ar' ? 'الكمية مطلوبة' : 'Quantity is required';
    } else if (parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = language === 'ar' ? 'يجب أن تكون الكمية أكبر من صفر' : 'Quantity must be greater than zero';
    }
    
    if (!formData.cost_per_kg) {
      newErrors.cost_per_kg = language === 'ar' ? 'التكلفة لكل كجم مطلوبة' : 'Cost per kg is required';
    } else if (parseFloat(formData.cost_per_kg) <= 0) {
      newErrors.cost_per_kg = language === 'ar' ? 'يجب أن تكون التكلفة لكل كجم أكبر من صفر' : 'Cost per kg must be greater than zero';
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
      
      // حساب التكلفة الإجمالية
      // Calculate total cost
      const quantity = parseFloat(formData.quantity);
      const costPerKg = parseFloat(formData.cost_per_kg);
      const totalCost = quantity * costPerKg;
      
      console.log('Total cost:', totalCost);
      
      // محاكاة تأخير الشبكة
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // التنقل إلى صفحة التغذية بعد النجاح
      // Navigate to feeding page after success
      router.push('/feeding');
    } catch (error) {
      console.error('Error submitting form:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // خيارات أنواع العلف
  // Feed type options
  const feedTypeOptions = [
    { value: 'Starter Feed', label: 'Starter Feed', arabicLabel: 'علف بادئ' },
    { value: 'Grower Feed', label: 'Grower Feed', arabicLabel: 'علف نامي' },
    { value: 'Finisher Feed', label: 'Finisher Feed', arabicLabel: 'علف ناهي' }
  ];
  
  // تحويل قائمة الدفعات إلى خيارات للقائمة المنسدلة
  // Convert batches to dropdown options
  const batchOptions = batches.map(batch => ({
    value: batch.batch_id,
    label: `${batch.batch_id} (${batch.breed} - ${batch.current_count})`,
    arabicLabel: `${batch.batch_id} (${batch.breed} - ${batch.current_count})`
  }));
  
  // العودة إلى صفحة التغذية
  // Return to feeding page
  const handleBack = () => {
    router.push('/feeding');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Add Feeding Record" 
        arabicTitle="إضافة سجل تغذية" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى سجلات التغذية' : 'Back to Feeding Records'}
        </Button>
        
        <Card 
          title="Add Feeding Record" 
          arabicTitle="إضافة سجل تغذية"
        >
          <Form 
            onSubmit={handleSubmit}
            submitLabel="Add Record"
            arabicSubmitLabel="إضافة السجل"
            cancelLabel="Cancel"
            arabicCancelLabel="إلغاء"
            onCancel={handleBack}
            isLoading={isSubmitting}
          >
            <Select 
              id="batch_id"
              name="batch_id"
              label="Batch"
              arabicLabel="الدفعة"
              options={batchOptions}
              value={formData.batch_id}
              onChange={handleChange}
              required
              error={errors.batch_id}
              arabicError={errors.batch_id}
            />
            
            <InputField 
              id="feed_date"
              name="feed_date"
              label="Feed Date"
              arabicLabel="تاريخ التغذية"
              type="date"
              value={formData.feed_date}
              onChange={handleChange}
              required
              error={errors.feed_date}
              arabicError={errors.feed_date}
            />
            
            <Select 
              id="feed_type"
              name="feed_type"
              label="Feed Type"
              arabicLabel="نوع العلف"
              options={feedTypeOptions}
              value={formData.feed_type}
              onChange={handleChange}
              required
              error={errors.feed_type}
              arabicError={errors.feed_type}
            />
            
            <InputField 
              id="quantity"
              name="quantity"
              label="Quantity (kg)"
              arabicLabel="الكمية (كجم)"
              type="number"
              placeholder="e.g. 250"
              arabicPlaceholder="مثال: 250"
              value={formData.quantity}
              onChange={handleChange}
              required
              min={0.1}
              step={0.1}
              error={errors.quantity}
              arabicError={errors.quantity}
            />
            
            <InputField 
              id="cost_per_kg"
              name="cost_per_kg"
              label="Cost per kg"
              arabicLabel="التكلفة لكل كجم"
              type="number"
              placeholder="e.g. 1.2"
              arabicPlaceholder="مثال: 1.2"
              value={formData.cost_per_kg}
              onChange={handleChange}
              required
              min={0.01}
              step={0.01}
              error={errors.cost_per_kg}
              arabicError={errors.cost_per_kg}
            />
            
            <InputField 
              id="feed_time"
              name="feed_time"
              label="Feed Time"
              arabicLabel="وقت التغذية"
              type="time"
              value={formData.feed_time}
              onChange={handleChange}
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
