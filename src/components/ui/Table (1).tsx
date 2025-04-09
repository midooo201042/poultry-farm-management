{/* 
  مكون الجدول
  Table Component
  
  هذا المكون يوفر جدول قابل لإعادة الاستخدام مع دعم للغة العربية
  This component provides a reusable table with Arabic language support
*/}

'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Search, Edit, Trash, Eye } from 'lucide-react';

interface Column {
  key: string;
  title: string;
  arabicTitle: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  actions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    onView?: (row: any) => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
  };
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
}

export default function Table({
  columns,
  data,
  onRowClick,
  actions,
  searchable = true,
  pagination = true,
  itemsPerPage = 10
}: TableProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // استرجاع إعدادات اللغة من التخزين المحلي
  // Get language setting from local storage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  // تصفية البيانات حسب البحث
  // Filter data based on search term
  const filteredData = searchTerm
    ? data.filter(item =>
        columns.some(column =>
          String(item[column.key])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // ترتيب البيانات
  // Sort data
  const sortedData = React.useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // تقسيم البيانات إلى صفحات
  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, pagination, itemsPerPage]);

  // إجمالي عدد الصفحات
  // Total number of pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // تغيير ترتيب العمود
  // Change column sort
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {searchable && (
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 flex items-center pl-3 rtl:pl-0 rtl:pr-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort(column.key)}
                >
                  <div className="flex items-center">
                    <span>{language === 'ar' ? column.arabicTitle : column.title}</span>
                    {sortConfig?.key === column.key ? (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp className="ml-1 rtl:mr-1 rtl:ml-0 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 rtl:mr-1 rtl:ml-0 h-4 w-4" />
                      )
                    ) : (
                      <div className="ml-1 rtl:mr-1 rtl:ml-0 h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left rtl:text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''
                  }`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        {actions.view && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              actions.onView && actions.onView(row);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        )}
                        {actions.edit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              actions.onEdit && actions.onEdit(row);
                            }}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        {actions.delete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              actions.onDelete && actions.onDelete(row);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  {language === 'ar' ? 'لا توجد بيانات' : 'No data available'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {language === 'ar'
                ? `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${
                    Math.min(currentPage * itemsPerPage, sortedData.length)
                  } من أصل ${sortedData.length} سجل`
                : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${
                    Math.min(currentPage * itemsPerPage, sortedData.length)
                  } of ${sortedData.length} entries`}
            </p>
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {language === 'ar' ? 'السابق' : 'Previous'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                  : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
