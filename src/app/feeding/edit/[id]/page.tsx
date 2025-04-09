{/* 
  صفحة تعديل سجل التغذية
  Edit Feeding Record Page
  
  هذه الصفحة تتيح تعديل سجل تغذية موجود
  This page allows editing an existing feeding record
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

export default function EditFeedingRecordPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // نموذج البيانات
  // Form data
  const [formData, setFormData] = useState({
    batch_id: '',
    feed_date: '',
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
    
    // استرجاع بيانات سجل التغذية
    // Fetch feeding record data
    fetchFeedingRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل التغذية من قاعدة البيانات
  // Fetch feeding record from database
  const fetchFeedingRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: FeedingRecord = {
        id: parseInt(params.id),
        batch_id: 'B2025001',
        feed_date: '2025-04-08',
        feed_type: 'Grower Feed',
        quantity: 400,
        cost_per_kg: 1.15,
        total_cost: 460,
        feed_time: '08:00',
        notes: 'Switched to grower feed',
        created_at: '2025-04-08T08:20:00Z'
      };
      
      // تعيين بيانات النموذج
      // Set form data
      setFormData({
        batch_id: sampleRecord.batch_id,
        feed_date: sampleRecord.feed_date,
        feed_type: sampleRecord.feed_type,
        quantity: sampleRecord.quantity.toString(),
        cost_per_kg: sampleRecord.cost_per_kg.toString(),
        feed_time: sampleRecord.feed_time || '',
        notes: sampleRecord.notes || ''
      });
    } catch (error) {
      console.error('Error fetching feeding record:', error);
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
      
      // التنقل إلى صفحة تفاصيل سجل التغذية بعد النجاح
      // Navigate to feeding record details page after success
      router.push(`/feeding/${params.id}`);
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
  
  // العودة إلى صفحة تفاصيل سجل التغذية
  // Return to feeding record details page
  const handleBack = () => {
    router.push(`/feeding/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Edit Feeding Record" 
        arabicTitle="تعديل سجل التغذية" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى تفاصيل السجل' : 'Back to Record Details'}
        </Button>
        
        <Card 
          title="Edit Feeding Record" 
          arabicTitle="تعديل سجل التغذية"
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
                value={formData.batch_id}
                onChange={handleChange}
                disabled
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
          )}
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
