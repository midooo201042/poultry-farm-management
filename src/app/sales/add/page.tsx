{/* 
  صفحة إضافة سجل مبيعات جديد
  Add New Sales Record Page
  
  هذه الصفحة تتيح إضافة سجل مبيعات جديد
  This page allows adding a new sales record
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
  average_weight: number;
}

export default function AddSalesRecordPage() {
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
    sale_date: new Date().toISOString().split('T')[0],
    quantity: '',
    weight_total: '',
    price_per_kg: '',
    customer_name: '',
    payment_method: 'Cash',
    payment_status: 'paid',
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
          current_count: 3850,
          average_weight: 2.2
        },
        {
          batch_id: 'B2025002',
          breed: 'Ross 308',
          current_count: 5450,
          average_weight: 2.1
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
    
    // إذا تم تغيير الدفعة، قم بتحديث الوزن الإجمالي بناءً على الكمية والوزن المتوسط
    // If batch changed, update total weight based on quantity and average weight
    if (name === 'batch_id') {
      const selectedBatch = batches.find(batch => batch.batch_id === value);
      if (selectedBatch && formData.quantity) {
        const quantity = parseInt(formData.quantity);
        const totalWeight = quantity * selectedBatch.average_weight;
        setFormData(prev => ({ ...prev, weight_total: totalWeight.toString() }));
      }
    }
    
    // إذا تم تغيير الكمية، قم بتحديث الوزن الإجمالي بناءً على الوزن المتوسط للدفعة
    // If quantity changed, update total weight based on batch average weight
    if (name === 'quantity') {
      const selectedBatch = batches.find(batch => batch.batch_id === formData.batch_id);
      if (selectedBatch && value) {
        const quantity = parseInt(value);
        const totalWeight = quantity * selectedBatch.average_weight;
        setFormData(prev => ({ ...prev, weight_total: totalWeight.toString() }));
      }
    }
    
    // حساب الإيراد الإجمالي عند تغيير الوزن الإجمالي أو السعر لكل كجم
    // Calculate total revenue when total weight or price per kg changes
    if ((name === 'weight_total' || name === 'price_per_kg') && formData.weight_total && formData.price_per_kg) {
      const weightTotal = parseFloat(name === 'weight_total' ? value : formData.weight_total);
      const pricePerKg = parseFloat(name === 'price_per_kg' ? value : formData.price_per_kg);
      
      if (!isNaN(weightTotal) && !isNaN(pricePerKg)) {
        const totalRevenue = weightTotal * pricePerKg;
        console.log(`Total revenue calculated: ${totalRevenue}`);
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
    
    if (!formData.sale_date) {
      newErrors.sale_date = language === 'ar' ? 'تاريخ البيع مطلوب' : 'Sale date is required';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = language === 'ar' ? 'الكمية مطلوبة' : 'Quantity is required';
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = language === 'ar' ? 'يجب أن تكون الكمية أكبر من صفر' : 'Quantity must be greater than zero';
    } else {
      // التحقق من أن الكمية لا تتجاوز عدد الطيور المتاحة في الدفعة
      // Check that quantity doesn't exceed available birds in batch
      const selectedBatch = batches.find(batch => batch.batch_id === formData.batch_id);
      if (selectedBatch && parseInt(formData.quantity) > selectedBatch.current_count) {
        newErrors.quantity = language === 'ar' 
          ? `الكمية تتجاوز عدد الطيور المتاحة (${selectedBatch.current_count})` 
          : `Quantity exceeds available birds (${selectedBatch.current_count})`;
      }
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
      
      // التنقل إلى صفحة المبيعات بعد النجاح
      // Navigate to sales page after success
      router.push('/sales');
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
  
  // تحويل قائمة الدفعات إلى خيارات للقائمة المنسدلة
  // Convert batches to dropdown options
  const batchOptions = batches.map(batch => ({
    value: batch.batch_id,
    label: `${batch.batch_id} (${batch.breed} - ${batch.current_count} birds, Avg: ${batch.average_weight}kg)`,
    arabicLabel: `${batch.batch_id} (${batch.breed} - ${batch.current_count} طائر، متوسط: ${batch.average_weight} كجم)`
  }));
  
  // العودة إلى صفحة المبيعات
  // Return to sales page
  const handleBack = () => {
    router.push('/sales');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header 
        title="Add Sales Record" 
        arabicTitle="إضافة سجل مبيعات" 
      />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          className="mb-4"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          {language === 'ar' ? 'العودة إلى سجلات المبيعات' : 'Back to Sales Records'}
        </Button>
        
        <Card 
          title="Add Sales Record" 
          arabicTitle="إضافة سجل مبيعات"
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
        </Card>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
