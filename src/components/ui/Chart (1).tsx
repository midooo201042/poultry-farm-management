{/* 
  مكون الرسم البياني
  Chart Component
  
  هذا المكون يوفر رسم بياني قابل لإعادة الاستخدام مع دعم للغة العربية
  This component provides a reusable chart with Arabic language support
*/}

'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartProps {
  type: 'line' | 'bar';
  data: any[];
  xKey: string;
  yKeys: {
    key: string;
    color: string;
    name: string;
    arabicName: string;
  }[];
  title?: string;
  arabicTitle?: string;
  xLabel?: string;
  arabicXLabel?: string;
  yLabel?: string;
  arabicYLabel?: string;
  height?: number;
}

export default function Chart({
  type,
  data,
  xKey,
  yKeys,
  title,
  arabicTitle,
  xLabel,
  arabicXLabel,
  yLabel,
  arabicYLabel,
  height = 300
}: ChartProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // تخصيص مكون التلميح
  // Customize tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
          <p className="text-gray-600 dark:text-gray-300">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${language === 'ar' ? yKeys.find(y => y.key === entry.dataKey)?.arabicName : yKeys.find(y => y.key === entry.dataKey)?.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {(title || arabicTitle) && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {language === 'ar' ? arabicTitle : title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xKey} 
              label={{ 
                value: language === 'ar' ? arabicXLabel : xLabel, 
                position: 'insideBottom', 
                offset: -5 
              }} 
            />
            <YAxis 
              label={{ 
                value: language === 'ar' ? arabicYLabel : yLabel, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value, entry, index) => {
              const yKey = yKeys.find(y => y.key === entry.dataKey);
              return language === 'ar' ? yKey?.arabicName : yKey?.name;
            }} />
            {yKeys.map((yKey, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={yKey.key}
                stroke={yKey.color}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xKey} 
              label={{ 
                value: language === 'ar' ? arabicXLabel : xLabel, 
                position: 'insideBottom', 
                offset: -5 
              }} 
            />
            <YAxis 
              label={{ 
                value: language === 'ar' ? arabicYLabel : yLabel, 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value, entry, index) => {
              const yKey = yKeys.find(y => y.key === entry.dataKey);
              return language === 'ar' ? yKey?.arabicName : yKey?.name;
            }} />
            {yKeys.map((yKey, index) => (
              <Bar
                key={index}
                dataKey={yKey.key}
                fill={yKey.color}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
