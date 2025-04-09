{/* 
  صفحة إضافة سجل دواء أو لقاح جديد
  Add New Medication Record Page
  
  هذه الصفحة تتيح إضافة سجل دواء أو لقاح جديد
  This page allows adding a new medication or vaccination record
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

export default function AddMedicationRecordPage() {
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
    application_date: new Date().toISOString().split('T')[0],
    medication_type: '',
    medication_name: '',
    dosage: '',
    application_method: '',
    cost: '',
    withdrawal_period_days: '',
    next_due_date: '',
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
    
    // إذا تم تغيير نوع الدواء إلى لقاح، قم بتعيين فترة السحب إلى 0
    // If medication type changed to Vaccine, set withdrawal period to 0
    if (name === 'medication_type' && value === 'Vaccine') {
      setFormData(prev => ({ ...prev, withdrawal_period_days: '0' }));
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
    
    if (!formData.application_date) {
      newErrors.application_date = language === 'ar' ? 'تاريخ التطبيق مطلوب' : 'Application date is required';
    }
    
    if (!formData.medication_type) {
      newErrors.medication_type = language === 'ar' ? 'نوع الدواء/اللقاح مطلوب' : 'Medication type is required';
    }
    
    if (!formData.medication_name) {
      newErrors.medication_name = language === 'ar' ? 'اسم الدواء/اللقاح مطلوب' : 'Medication name is required';
    }
    
    if (!formData.dosage) {
      newErrors.dosage = language === 'ar' ? 'الجرعة مطلوبة' : 'Dosage is required';
    }
    
    if (!formData.application_method) {
      newErrors.application_method = language === 'ar' ? 'طريقة التطبيق مطلوبة' : 'Application method is required';
    }
    
    if (!formData.cost) {
      newErrors.cost = language === 'ar' ? 'التكلفة مطلوبة' : 'Cost is required';
    } else if (parseFloat(formData.cost) < 0) {
      newErrors.cost = language === 'ar' ? 'يجب أن تكون التكلفة أكبر من أو تساوي صفر' : 'Cost must be greater than or equal to zero';
    }
    
    if (formData.medication_type === 'Vaccine' && !formData.next_due_date) {
      newErrors.next_due_date = language === 'ar' ? 'تاريخ الاستحقاق التالي مطلوب للقاحات' : 'Next due date is required for vaccines';
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
      
      // التنقل إلى صفحة الأدوية واللقاحات بعد النجاح
      // Navigate to medication page after success
      router.push('/medication');
    } catch (error) {
      console.error('Error submitting form:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // خيارات أنواع الأدوية
  // Medication type options
  const medicationTypeOptions = [
    { value: 'Vaccine', label: 'Vaccine', arabicLabel: 'لقاح' },
    { value: 'Antibiotic', label: 'Antibiotic', arabicLabel: 'مضاد حيوي' },
    { value: 'Vitamin', label: 'Vitamin', arabicLabel: 'فيتامين' },
    { value: 'Other', label: 'Other', arabicLabel: 'أخرى' }
  ];
  
  // خيارات طرق التطبيق
  // Application method options
  const applicationMethodOptions = [
    { value: 'Water', label: 'Water', arabicLabel: 'ماء الشرب' },
    { value: 'Feed', label: 'Feed', arabicLabel: 'العلف' },
    { value: 'Injection', label: 'Injection', arabicLabel: 'حقن' },
    { value: 'Spray', label: 'Spray', arabicLabel: 'رش' },
    { value: 'Eye drop', label: 'Eye drop', arabicLabel: 'قطرة عين' }
  ];
  
  // تحويل قائمة الدفعات إلى خيارات للقائمة المنسدلة
  // Convert batches to dropdown options
  const batchOptions = batches.map(batch => ({
    value: batch.batch_id,
    label: `${batch.batch_id} (${batch.breed} - ${batch.current_count})`,
    arabicLabel: `${batch.batch_id} (${batch.breed} - ${batch.current_count})`
  }));
  
  // العودة إلى صفحة الأدوية واللقاحات
  // Return to medication page
  const handleBack = () => {
    router.push('/medication');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Add Medication Record" 
        arabicTitle="إضافة سجل دواء/لقاح" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى سجلات الأدوية واللقاحات' : 'Back to Medication Records'}
        </Button>
        
        <Card 
          title="Add Medication Record" 
          arabicTitle="إضافة سجل دواء/لقاح"
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
              id="application_date"
              name="application_date"
              label="Application Date"
              arabicLabel="تاريخ التطبيق"
              type="date"
              value={formData.application_date}
              onChange={handleChange}
              required
              error={errors.application_date}
              arabicError={errors.application_date}
            />
            
            <Select 
              id="medication_type"
              name="medication_type"
              label="Medication Type"
              arabicLabel="نوع الدواء/اللقاح"
              options={medicationTypeOptions}
              value={formData.medication_type}
              onChange={handleChange}
              required
              error={errors.medication_type}
              arabicError={errors.medication_type}
            />
            
            <InputField 
              id="medication_name"
              name="medication_name"
              label="Medication Name"
              arabicLabel="اسم الدواء/اللقاح"
              placeholder="e.g. Newcastle Disease Vaccine"
              arabicPlaceholder="مثال: لقاح مرض نيوكاسل"
              value={formData.medication_name}
              onChange={handleChange}
              required
              error={errors.medication_name}
              arabicError={errors.medication_name}
            />
            
            <InputField 
              id="dosage"
              name="dosage"
              label="Dosage"
              arabicLabel="الجرعة"
              placeholder="e.g. 1 drop per bird"
              arabicPlaceholder="مثال: قطرة واحدة لكل طائر"
              value={formData.dosage}
              onChange={handleChange}
              required
              error={errors.dosage}
              arabicError={errors.dosage}
            />
            
            <Select 
              id="application_method"
              name="application_method"
              label="Application Method"
              arabicLabel="طريقة التطبيق"
              options={applicationMethodOptions}
              value={formData.application_method}
              onChange={handleChange}
              required
              error={errors.application_method}
              arabicError={errors.application_method}
            />
            
            <InputField 
              id="cost"
              name="cost"
              label="Cost"
              arabicLabel="التكلفة"
              type="number"
              placeholder="e.g. 150"
              arabicPlaceholder="مثال: 150"
              value={formData.cost}
              onChange={handleChange}
              required
              min={0}
              step={0.01}
              error={errors.cost}
              arabicError={errors.cost}
            />
            
            <InputField 
              id="withdrawal_period_days"
              name="withdrawal_period_days"
              label="Withdrawal Period (days)"
              arabicLabel="فترة السحب (أيام)"
              type="number"
              placeholder="e.g. 7"
              arabicPlaceholder="مثال: 7"
              value={formData.withdrawal_period_days}
              onChange={handleChange}
              min={0}
              disabled={formData.medication_type === 'Vaccine'}
            />
            
            {formData.medication_type === 'Vaccine' && (
              <InputField 
                id="next_due_date"
                name="next_due_date"
                label="Next Due Date"
                arabicLabel="تاريخ الاستحقاق التالي"
                type="date"
                value={formData.next_due_date}
                onChange={handleChange}
                required
                error={errors.next_due_date}
                arabicError={errors.next_due_date}
              />
            )}
            
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
