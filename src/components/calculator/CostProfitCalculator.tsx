// مكون حاسبة التكلفة والربح
// Cost and Profit Calculator Component

'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { Calculator } from 'lucide-react';

// نموذج بيانات الحاسبة
// Calculator data model
interface CalculatorData {
  initialBirdCount: string;
  birdCost: string;
  feedCost: string;
  medicationCost: string;
  utilitiesCost: string;
  laborCost: string;
  otherCosts: string;
  expectedMortality: string;
  expectedWeight: string;
  expectedPricePerKg: string;
}

// نتائج الحساب
// Calculation results
interface CalculationResults {
  totalCost: number;
  costPerBird: number;
  expectedRevenue: number;
  expectedProfit: number;
  profitMargin: number;
  breakEvenPricePerKg: number;
}

export default function CostProfitCalculator() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    initialBirdCount: '5000',
    birdCost: '5',
    feedCost: '25000',
    medicationCost: '5000',
    utilitiesCost: '3000',
    laborCost: '7000',
    otherCosts: '2000',
    expectedMortality: '5',
    expectedWeight: '2.2',
    expectedPricePerKg: '5.5'
  });
  
  const [results, setResults] = useState<CalculationResults | null>(null);
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);
  
  // تحديث بيانات الحاسبة
  // Update calculator data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCalculatorData(prev => ({ ...prev, [name]: value }));
  };
  
  // حساب التكلفة والربح
  // Calculate cost and profit
  const calculateResults = () => {
    // تحويل القيم إلى أرقام
    // Convert values to numbers
    const initialBirdCount = parseFloat(calculatorData.initialBirdCount) || 0;
    const birdCost = parseFloat(calculatorData.birdCost) || 0;
    const feedCost = parseFloat(calculatorData.feedCost) || 0;
    const medicationCost = parseFloat(calculatorData.medicationCost) || 0;
    const utilitiesCost = parseFloat(calculatorData.utilitiesCost) || 0;
    const laborCost = parseFloat(calculatorData.laborCost) || 0;
    const otherCosts = parseFloat(calculatorData.otherCosts) || 0;
    const expectedMortality = parseFloat(calculatorData.expectedMortality) || 0;
    const expectedWeight = parseFloat(calculatorData.expectedWeight) || 0;
    const expectedPricePerKg = parseFloat(calculatorData.expectedPricePerKg) || 0;
    
    // حساب التكلفة الإجمالية
    // Calculate total cost
    const totalCost = (initialBirdCount * birdCost) + feedCost + medicationCost + utilitiesCost + laborCost + otherCosts;
    
    // حساب عدد الطيور المتوقع بعد النفوق
    // Calculate expected bird count after mortality
    const expectedBirdCount = initialBirdCount * (1 - (expectedMortality / 100));
    
    // حساب التكلفة لكل طائر
    // Calculate cost per bird
    const costPerBird = totalCost / expectedBirdCount;
    
    // حساب الإيراد المتوقع
    // Calculate expected revenue
    const expectedRevenue = expectedBirdCount * expectedWeight * expectedPricePerKg;
    
    // حساب الربح المتوقع
    // Calculate expected profit
    const expectedProfit = expectedRevenue - totalCost;
    
    // حساب هامش الربح
    // Calculate profit margin
    const profitMargin = (expectedProfit / expectedRevenue) * 100;
    
    // حساب سعر التعادل لكل كجم
    // Calculate break-even price per kg
    const breakEvenPricePerKg = totalCost / (expectedBirdCount * expectedWeight);
    
    // تعيين النتائج
    // Set results
    setResults({
      totalCost,
      costPerBird,
      expectedRevenue,
      expectedProfit,
      profitMargin,
      breakEvenPricePerKg
    });
  };
  
  return (
    <Card title="Cost & Profit Calculator" arabicTitle="حاسبة التكلفة والربح">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'بيانات التكلفة' : 'Cost Data'}
          </h3>
          
          <InputField 
            id="initialBirdCount"
            name="initialBirdCount"
            label="Initial Bird Count"
            arabicLabel="عدد الطيور الأولي"
            type="number"
            value={calculatorData.initialBirdCount}
            onChange={handleChange}
            min={1}
          />
          
          <InputField 
            id="birdCost"
            name="birdCost"
            label="Cost per Chick"
            arabicLabel="تكلفة الكتكوت الواحد"
            type="number"
            value={calculatorData.birdCost}
            onChange={handleChange}
            min={0.01}
            step={0.01}
          />
          
          <InputField 
            id="feedCost"
            name="feedCost"
            label="Total Feed Cost"
            arabicLabel="تكلفة العلف الإجمالية"
            type="number"
            value={calculatorData.feedCost}
            onChange={handleChange}
            min={0}
          />
          
          <InputField 
            id="medicationCost"
            name="medicationCost"
            label="Medication Cost"
            arabicLabel="تكلفة الأدوية"
            type="number"
            value={calculatorData.medicationCost}
            onChange={handleChange}
            min={0}
          />
          
          <InputField 
            id="utilitiesCost"
            name="utilitiesCost"
            label="Utilities Cost"
            arabicLabel="تكلفة المرافق"
            type="number"
            value={calculatorData.utilitiesCost}
            onChange={handleChange}
            min={0}
          />
          
          <InputField 
            id="laborCost"
            name="laborCost"
            label="Labor Cost"
            arabicLabel="تكلفة العمالة"
            type="number"
            value={calculatorData.laborCost}
            onChange={handleChange}
            min={0}
          />
          
          <InputField 
            id="otherCosts"
            name="otherCosts"
            label="Other Costs"
            arabicLabel="تكاليف أخرى"
            type="number"
            value={calculatorData.otherCosts}
            onChange={handleChange}
            min={0}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {language === 'ar' ? 'بيانات الإنتاج والمبيعات' : 'Production & Sales Data'}
          </h3>
          
          <InputField 
            id="expectedMortality"
            name="expectedMortality"
            label="Expected Mortality (%)"
            arabicLabel="نسبة النفوق المتوقعة (%)"
            type="number"
            value={calculatorData.expectedMortality}
            onChange={handleChange}
            min={0}
            max={100}
            step={0.1}
          />
          
          <InputField 
            id="expectedWeight"
            name="expectedWeight"
            label="Expected Weight per Bird (kg)"
            arabicLabel="الوزن المتوقع للطائر (كجم)"
            type="number"
            value={calculatorData.expectedWeight}
            onChange={handleChange}
            min={0.1}
            step={0.1}
          />
          
          <InputField 
            id="expectedPricePerKg"
            name="expectedPricePerKg"
            label="Expected Price per kg"
            arabicLabel="السعر المتوقع لكل كجم"
            type="number"
            value={calculatorData.expectedPricePerKg}
            onChange={handleChange}
            min={0.01}
            step={0.01}
          />
          
          <div className="mt-6">
            <Button 
              variant="primary" 
              onClick={calculateResults}
              icon={<Calculator className="h-5 w-5" />}
              className="w-full"
            >
              {language === 'ar' ? 'حساب التكلفة والربح' : 'Calculate Cost & Profit'}
            </Button>
          </div>
          
          {results && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                {language === 'ar' ? 'نتائج الحساب' : 'Calculation Results'}
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'التكلفة الإجمالية' : 'Total Cost'}:</span>
                  <span className="font-medium">{results.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'التكلفة لكل طائر' : 'Cost per Bird'}:</span>
                  <span className="font-medium">{results.costPerBird.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الإيراد المتوقع' : 'Expected Revenue'}:</span>
                  <span className="font-medium">{results.expectedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'الربح المتوقع' : 'Expected Profit'}:</span>
                  <span className={`font-medium ${results.expectedProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {results.expectedProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'هامش الربح' : 'Profit Margin'}:</span>
                  <span className={`font-medium ${results.profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {results.profitMargin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'ar' ? 'سعر التعادل لكل كجم' : 'Break-even Price/kg'}:</span>
                  <span className="font-medium">{results.breakEvenPricePerKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
