{/* 
  صفحة تعديل سجل الدواء أو اللقاح
  Edit Medication Record Page
  
  هذه الصفحة تتيح تعديل سجل دواء أو لقاح موجود
  This page allows editing an existing medication or vaccination record
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

// نموذج بيانات الأدوية واللقاحات
// Medication data model
interface MedicationRecord {
  id: number;
  batch_id: string;
  application_date: string;
  medication_type: string;
  medication_name: string;
  dosage: string;
  application_method: string;
  cost: number;
  withdrawal_period_days?: number;
  next_due_date?: string;
  notes?: string;
  created_at: string;
}

export default function EditMedicationRecordPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // نموذج البيانات
  // Form data
  const [formData, setFormData] = useState({
    batch_id: '',
    application_date: '',
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
    
    // استرجاع بيانات سجل الدواء
    // Fetch medication record data
    fetchMedicationRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل الدواء من قاعدة البيانات
  // Fetch medication record from database
  const fetchMedicationRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: MedicationRecord = {
        id: parseInt(params.id),
        batch_id: 'B2025001',
        application_date: '2025-04-02',
        medication_type: 'Vaccine',
        medication_name: 'Newcastle Disease Vaccine',
        dosage: '1 drop per bird',
        application_method: 'Eye drop',
        cost: 150,
        withdrawal_period_days: 0,
        next_due_date: '2025-04-16',
        notes: 'First vaccination',
        created_at: '2025-04-02T09:30:00Z'
      };
      
      // تعيين بيانات النموذج
      // Set form data
      setFormData({
        batch_id: sampleRecord.batch_id,
        application_date: sampleRecord.application_date,
        medication_type: sampleRecord.medication_type,
        medication_name: sampleRecord.medication_name,
        dosage: sampleRecord.dosage,
        application_method: sampleRecord.application_method,
        cost: sampleRecord.cost.toString(),
        withdrawal_period_days: sampleRecord.withdrawal_period_days?.toString() || '',
        next_due_date: sampleRecord.next_due_date || '',
        notes: sampleRecord.notes || ''
      });
    } catch (error) {
      console.error('Error fetching medication record:', error);
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
      
      // التنقل إلى صفحة تفاصيل سجل الدواء بعد النجاح
      // Navigate to medication record details page after success
      router.push(`/medication/${params.id}`);
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
  
  // العودة إلى صفحة تفاصيل سجل الدواء
  // Return to medication record details page
  const handleBack = () => {
    router.push(`/medication/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Edit Medication Record" 
        arabicTitle="تعديل سجل الدواء/اللقاح" 
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
          title="Edit Medication Record" 
          arabicTitle="تعديل سجل الدواء/اللقاح"
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
          )}
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
