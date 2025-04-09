{/* 
  صفحة تعديل سجل المصروفات
  Edit Expense Record Page
  
  هذه الصفحة تتيح تعديل سجل مصروفات موجود
  This page allows editing an existing expense record
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

// نموذج بيانات المصروفات
// Expense data model
interface ExpenseRecord {
  id: number;
  expense_date: string;
  expense_type: string;
  amount: number;
  payment_method: string;
  description?: string;
  vendor?: string;
  receipt_number?: string;
  created_at: string;
}

export default function EditExpenseRecordPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // نموذج البيانات
  // Form data
  const [formData, setFormData] = useState({
    expense_date: '',
    expense_type: '',
    amount: '',
    payment_method: '',
    description: '',
    vendor: '',
    receipt_number: ''
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
    
    // استرجاع بيانات سجل المصروفات
    // Fetch expense record data
    fetchExpenseRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل المصروفات من قاعدة البيانات
  // Fetch expense record from database
  const fetchExpenseRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: ExpenseRecord = {
        id: parseInt(params.id),
        expense_date: '2025-04-01',
        expense_type: 'Feed',
        amount: 5000,
        payment_method: 'Bank Transfer',
        description: 'Monthly feed supply',
        vendor: 'Feed Supplier Co.',
        receipt_number: 'INV-2025-001',
        created_at: '2025-04-01T10:30:00Z'
      };
      
      // تعيين بيانات النموذج
      // Set form data
      setFormData({
        expense_date: sampleRecord.expense_date,
        expense_type: sampleRecord.expense_type,
        amount: sampleRecord.amount.toString(),
        payment_method: sampleRecord.payment_method,
        description: sampleRecord.description || '',
        vendor: sampleRecord.vendor || '',
        receipt_number: sampleRecord.receipt_number || ''
      });
    } catch (error) {
      console.error('Error fetching expense record:', error);
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
    
    if (!formData.expense_date) {
      newErrors.expense_date = language === 'ar' ? 'تاريخ المصروف مطلوب' : 'Expense date is required';
    }
    
    if (!formData.expense_type) {
      newErrors.expense_type = language === 'ar' ? 'نوع المصروف مطلوب' : 'Expense type is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = language === 'ar' ? 'المبلغ مطلوب' : 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = language === 'ar' ? 'يجب أن يكون المبلغ أكبر من صفر' : 'Amount must be greater than zero';
    }
    
    if (!formData.payment_method) {
      newErrors.payment_method = language === 'ar' ? 'طريقة الدفع مطلوبة' : 'Payment method is required';
    }
    
    if (!formData.description) {
      newErrors.description = language === 'ar' ? 'الوصف مطلوب' : 'Description is required';
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
      
      // التنقل إلى صفحة تفاصيل سجل المصروفات بعد النجاح
      // Navigate to expense record details page after success
      router.push(`/expenses/${params.id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // خيارات أنواع المصروفات
  // Expense type options
  const expenseTypeOptions = [
    { value: 'Feed', label: 'Feed', arabicLabel: 'علف' },
    { value: 'Medication', label: 'Medication', arabicLabel: 'أدوية' },
    { value: 'Utilities', label: 'Utilities', arabicLabel: 'مرافق' },
    { value: 'Labor', label: 'Labor', arabicLabel: 'عمالة' },
    { value: 'Equipment', label: 'Equipment', arabicLabel: 'معدات' },
    { value: 'Maintenance', label: 'Maintenance', arabicLabel: 'صيانة' },
    { value: 'Other', label: 'Other', arabicLabel: 'أخرى' }
  ];
  
  // خيارات طرق الدفع
  // Payment method options
  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash', arabicLabel: 'نقدي' },
    { value: 'Bank Transfer', label: 'Bank Transfer', arabicLabel: 'تحويل بنكي' },
    { value: 'Check', label: 'Check', arabicLabel: 'شيك' },
    { value: 'Credit Card', label: 'Credit Card', arabicLabel: 'بطاقة ائتمان' }
  ];
  
  // العودة إلى صفحة تفاصيل سجل المصروفات
  // Return to expense record details page
  const handleBack = () => {
    router.push(`/expenses/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Edit Expense Record" 
        arabicTitle="تعديل سجل المصروفات" 
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
          title="Edit Expense Record" 
          arabicTitle="تعديل سجل المصروفات"
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
                id="expense_date"
                name="expense_date"
                label="Expense Date"
                arabicLabel="تاريخ المصروف"
                type="date"
                value={formData.expense_date}
                onChange={handleChange}
                required
                error={errors.expense_date}
                arabicError={errors.expense_date}
              />
              
              <Select 
                id="expense_type"
                name="expense_type"
                label="Expense Type"
                arabicLabel="نوع المصروف"
                options={expenseTypeOptions}
                value={formData.expense_type}
                onChange={handleChange}
                required
                error={errors.expense_type}
                arabicError={errors.expense_type}
              />
              
              <InputField 
                id="amount"
                name="amount"
                label="Amount"
                arabicLabel="المبلغ"
                type="number"
                placeholder="e.g. 1000"
                arabicPlaceholder="مثال: 1000"
                value={formData.amount}
                onChange={handleChange}
                required
                min={0.01}
                step={0.01}
                error={errors.amount}
                arabicError={errors.amount}
              />
              
              <InputField 
                id="description"
                name="description"
                label="Description"
                arabicLabel="الوصف"
                placeholder="e.g. Monthly feed supply"
                arabicPlaceholder="مثال: توريد العلف الشهري"
                value={formData.description}
                onChange={handleChange}
                required
                error={errors.description}
                arabicError={errors.description}
              />
              
              <Select 
                id="payment_method"
                name="payment_method"
                label="Payment Method"
                arabicLabel="طريقة الدفع"
                options={paymentMethodOptions}
                value={formData.payment_method}
                onChange={handleChange}
                required
                error={errors.payment_method}
                arabicError={errors.payment_method}
              />
              
              <InputField 
                id="vendor"
                name="vendor"
                label="Vendor"
                arabicLabel="المورد"
                placeholder="e.g. Feed Supplier Co."
                arabicPlaceholder="مثال: شركة توريد الأعلاف"
                value={formData.vendor}
                onChange={handleChange}
              />
              
              <InputField 
                id="receipt_number"
                name="receipt_number"
                label="Receipt Number"
                arabicLabel="رقم الإيصال"
                placeholder="e.g. INV-2025-001"
                arabicPlaceholder="مثال: INV-2025-001"
                value={formData.receipt_number}
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
