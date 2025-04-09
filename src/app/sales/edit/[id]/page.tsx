{/* 
  صفحة تعديل سجل المبيعات
  Edit Sales Record Page
  
  هذه الصفحة تتيح تعديل سجل مبيعات موجود
  This page allows editing an existing sales record
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

// نموذج بيانات المبيعات
// Sales data model
interface SalesRecord {
  id: number;
  batch_id: string;
  sale_date: string;
  quantity: number;
  weight_total: number;
  price_per_kg: number;
  total_revenue: number;
  customer_name?: string;
  payment_method?: string;
  payment_status: string;
  notes?: string;
  created_at: string;
}

export default function EditSalesRecordPage({ params }: { params: { id: string } }) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // نموذج البيانات
  // Form data
  const [formData, setFormData] = useState({
    batch_id: '',
    sale_date: '',
    quantity: '',
    weight_total: '',
    price_per_kg: '',
    customer_name: '',
    payment_method: '',
    payment_status: '',
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
    
    // استرجاع بيانات سجل المبيعات
    // Fetch sales record data
    fetchSalesRecord();
  }, [params.id]);
  
  // استرجاع بيانات سجل المبيعات من قاعدة البيانات
  // Fetch sales record from database
  const fetchSalesRecord = async () => {
    setIsLoading(true);
    try {
      // في الإصدار النهائي، سيتم استبدال هذا بطلب API حقيقي
      // In the final version, this will be replaced with a real API request
      
      // بيانات تجريبية للعرض
      // Sample data for display
      const sampleRecord: SalesRecord = {
        id: parseInt(params.id),
        batch_id: 'B2025001',
        sale_date: '2025-04-08',
        quantity: 1000,
        weight_total: 2200,
        price_per_kg: 5.2,
        total_revenue: 11440,
        customer_name: 'Local Distributor',
        payment_method: 'Cash',
        payment_status: 'paid',
        notes: 'Partial batch sale',
        created_at: '2025-04-08T14:30:00Z'
      };
      
      // تعيين بيانات النموذج
      // Set form data
      setFormData({
        batch_id: sampleRecord.batch_id,
        sale_date: sampleRecord.sale_date,
        quantity: sampleRecord.quantity.toString(),
        weight_total: sampleRecord.weight_total.toString(),
        price_per_kg: sampleRecord.price_per_kg.toString(),
        customer_name: sampleRecord.customer_name || '',
        payment_method: sampleRecord.payment_method || 'Cash',
        payment_status: sampleRecord.payment_status,
        notes: sampleRecord.notes || ''
      });
    } catch (error) {
      console.error('Error fetching sales record:', error);
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
    
    if (!formData.sale_date) {
      newErrors.sale_date = language === 'ar' ? 'تاريخ البيع مطلوب' : 'Sale date is required';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = language === 'ar' ? 'الكمية مطلوبة' : 'Quantity is required';
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = language === 'ar' ? 'يجب أن تكون الكمية أكبر من صفر' : 'Quantity must be greater than zero';
    }
    
    if (!formData.weight_total) {
      newErrors.weight_total = language === 'ar' ? 'الوزن الإجمالي مطلوب' : 'Total weight is required';
    } else if (parseFloat(formData.weight_total) <= 0) {
      newErrors.weight_total = language === 'ar' ? 'يجب أن يكون الوزن الإجمالي أكبر من صفر' : 'Total weight must be greater than zero';
    }
    
    if (!formData.price_per_kg) {
      newErrors.price_per_kg = language === 'ar' ? 'السعر لكل كجم مطلوب' : 'Price per kg is required';
    } else if (parseFloat(formData.price_per_kg) <= 0) {
      newErrors.price_per_kg = language === 'ar' ? 'يجب أن يكون السعر لكل كجم أكبر من صفر' : 'Price per kg must be greater than zero';
    }
    
    if (!formData.payment_method) {
      newErrors.payment_method = language === 'ar' ? 'طريقة الدفع مطلوبة' : 'Payment method is required';
    }
    
    if (!formData.payment_status) {
      newErrors.payment_status = language === 'ar' ? 'حالة الدفع مطلوبة' : 'Payment status is required';
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
      
      // حساب الإيراد الإجمالي
      // Calculate total revenue
      const weightTotal = parseFloat(formData.weight_total);
      const pricePerKg = parseFloat(formData.price_per_kg);
      const totalRevenue = weightTotal * pricePerKg;
      
      console.log('Total revenue:', totalRevenue);
      
      // محاكاة تأخير الشبكة
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // التنقل إلى صفحة تفاصيل سجل المبيعات بعد النجاح
      // Navigate to sales record details page after success
      router.push(`/sales/${params.id}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      // يمكن إضافة إشعار خطأ هنا
      // Can add error notification here
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // خيارات طرق الدفع
  // Payment method options
  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash', arabicLabel: 'نقدي' },
    { value: 'Bank Transfer', label: 'Bank Transfer', arabicLabel: 'تحويل بنكي' },
    { value: 'Check', label: 'Check', arabicLabel: 'شيك' },
    { value: 'Credit Card', label: 'Credit Card', arabicLabel: 'بطاقة ائتمان' }
  ];
  
  // خيارات حالة الدفع
  // Payment status options
  const paymentStatusOptions = [
    { value: 'paid', label: 'Paid', arabicLabel: 'مدفوع' },
    { value: 'pending', label: 'Pending', arabicLabel: 'معلق' }
  ];
  
  // العودة إلى صفحة تفاصيل سجل المبيعات
  // Return to sales record details page
  const handleBack = () => {
    router.push(`/sales/${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Edit Sales Record" 
        arabicTitle="تعديل سجل المبيعات" 
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
          title="Edit Sales Record" 
          arabicTitle="تعديل سجل المبيعات"
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
                id="sale_date"
                name="sale_date"
                label="Sale Date"
                arabicLabel="تاريخ البيع"
                type="date"
                value={formData.sale_date}
                onChange={handleChange}
                required
                error={errors.sale_date}
                arabicError={errors.sale_date}
              />
              
              <InputField 
                id="quantity"
                name="quantity"
                label="Quantity (birds)"
                arabicLabel="الكمية (طيور)"
                type="number"
                placeholder="e.g. 1000"
                arabicPlaceholder="مثال: 1000"
                value={formData.quantity}
                onChange={handleChange}
                required
                min={1}
                step={1}
                error={errors.quantity}
                arabicError={errors.quantity}
              />
              
              <InputField 
                id="weight_total"
                name="weight_total"
                label="Total Weight (kg)"
                arabicLabel="الوزن الإجمالي (كجم)"
                type="number"
                placeholder="e.g. 2200"
                arabicPlaceholder="مثال: 2200"
                value={formData.weight_total}
                onChange={handleChange}
                required
                min={0.1}
                step={0.1}
                error={errors.weight_total}
                arabicError={errors.weight_total}
              />
              
              <InputField 
                id="price_per_kg"
                name="price_per_kg"
                label="Price per kg"
                arabicLabel="السعر لكل كجم"
                type="number"
                placeholder="e.g. 5.5"
                arabicPlaceholder="مثال: 5.5"
                value={formData.price_per_kg}
                onChange={handleChange}
                required
                min={0.01}
                step={0.01}
                error={errors.price_per_kg}
                arabicError={errors.price_per_kg}
              />
              
              <InputField 
                id="customer_name"
                name="customer_name"
                label="Customer Name"
                arabicLabel="اسم العميل"
                placeholder="e.g. Market A"
                arabicPlaceholder="مثال: سوق أ"
                value={formData.customer_name}
                onChange={handleChange}
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
              
              <Select 
                id="payment_status"
                name="payment_status"
                label="Payment Status"
                arabicLabel="حالة الدفع"
                options={paymentStatusOptions}
                value={formData.payment_status}
                onChange={handleChange}
                required
                error={errors.payment_status}
                arabicError={errors.payment_status}
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
