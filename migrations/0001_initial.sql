-- Migration number: 0001 	 2025-04-09
-- مخطط قاعدة البيانات لنظام إدارة مزرعة الدواجن
-- Database Schema for Poultry Farm Management System

-- حذف الجداول إذا كانت موجودة
-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS sales_records;
DROP TABLE IF EXISTS medication_records;
DROP TABLE IF EXISTS feeding_records;
DROP TABLE IF EXISTS weight_records;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;

-- إنشاء جدول المستخدمين
-- Create users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,         -- اسم المستخدم
  password TEXT NOT NULL,                -- كلمة المرور (مشفرة)
  name TEXT NOT NULL,                    -- الاسم
  role TEXT NOT NULL,                    -- الدور (مدير، موظف)
  email TEXT UNIQUE,                     -- البريد الإلكتروني
  last_login DATETIME,                   -- آخر تسجيل دخول
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول الإعدادات
-- Create settings table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT NOT NULL UNIQUE,      -- مفتاح الإعداد
  setting_value TEXT NOT NULL,           -- قيمة الإعداد
  setting_description TEXT,              -- وصف الإعداد
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول المخزون
-- Create inventory table
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL UNIQUE,         -- معرف الدفعة
  entry_date DATE NOT NULL,              -- تاريخ الإدخال
  initial_count INTEGER NOT NULL,        -- العدد الأولي
  current_count INTEGER NOT NULL,        -- العدد الحالي
  breed TEXT NOT NULL,                   -- السلالة
  source TEXT NOT NULL,                  -- المصدر
  status TEXT NOT NULL,                  -- الحالة (نشط، مباع، نافق)
  notes TEXT,                            -- ملاحظات
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول سجلات الوزن والنمو
-- Create weight records table
CREATE TABLE weight_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL,                -- معرف الدفعة
  record_date DATE NOT NULL,             -- تاريخ التسجيل
  age_days INTEGER NOT NULL,             -- العمر بالأيام
  sample_size INTEGER NOT NULL,          -- حجم العينة
  total_weight REAL NOT NULL,            -- الوزن الإجمالي (كجم)
  average_weight REAL NOT NULL,          -- متوسط الوزن (جم)
  weight_gain REAL,                      -- زيادة الوزن منذ آخر تسجيل
  feed_conversion_ratio REAL,            -- معدل تحويل العلف
  notes TEXT,                            -- ملاحظات
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES inventory(batch_id)
);

-- إنشاء جدول سجلات التغذية
-- Create feeding records table
CREATE TABLE feeding_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL,                -- معرف الدفعة
  feed_date DATE NOT NULL,               -- تاريخ التغذية
  feed_type TEXT NOT NULL,               -- نوع العلف
  quantity REAL NOT NULL,                -- الكمية (كجم)
  cost_per_kg REAL NOT NULL,             -- التكلفة لكل كجم
  total_cost REAL NOT NULL,              -- التكلفة الإجمالية
  feed_time TEXT,                        -- وقت التغذية
  notes TEXT,                            -- ملاحظات
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES inventory(batch_id)
);

-- إنشاء جدول سجلات الأدوية واللقاحات
-- Create medication records table
CREATE TABLE medication_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL,                -- معرف الدفعة
  application_date DATE NOT NULL,        -- تاريخ التطبيق
  medication_type TEXT NOT NULL,         -- نوع الدواء/اللقاح
  medication_name TEXT NOT NULL,         -- اسم الدواء/اللقاح
  dosage TEXT NOT NULL,                  -- الجرعة
  application_method TEXT NOT NULL,      -- طريقة التطبيق
  cost REAL NOT NULL,                    -- التكلفة
  withdrawal_period_days INTEGER,        -- فترة السحب بالأيام
  next_due_date DATE,                    -- تاريخ الاستحقاق التالي
  notes TEXT,                            -- ملاحظات
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES inventory(batch_id)
);

-- إنشاء جدول سجلات المبيعات والإيرادات
-- Create sales records table
CREATE TABLE sales_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL,                -- معرف الدفعة
  sale_date DATE NOT NULL,               -- تاريخ البيع
  quantity INTEGER NOT NULL,             -- الكمية المباعة
  weight_total REAL NOT NULL,            -- إجمالي الوزن المباع (كجم)
  price_per_kg REAL NOT NULL,            -- السعر لكل كجم
  total_revenue REAL NOT NULL,           -- إجمالي الإيرادات
  customer_name TEXT,                    -- اسم العميل
  payment_method TEXT,                   -- طريقة الدفع
  payment_status TEXT NOT NULL,          -- حالة الدفع
  notes TEXT,                            -- ملاحظات
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES inventory(batch_id)
);

-- إنشاء جدول معلومات الموظفين
-- Create employees table
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,                    -- الاسم
  position TEXT NOT NULL,                -- المنصب
  contact_number TEXT,                   -- رقم الاتصال
  email TEXT,                            -- البريد الإلكتروني
  hire_date DATE NOT NULL,               -- تاريخ التوظيف
  salary REAL NOT NULL,                  -- الراتب
  address TEXT,                          -- العنوان
  status TEXT NOT NULL,                  -- الحالة (نشط، غير نشط)
  notes TEXT,                            -- ملاحظات
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول النفقات والتكاليف
-- Create expenses table
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expense_date DATE NOT NULL,            -- تاريخ النفقة
  category TEXT NOT NULL,                -- الفئة
  description TEXT NOT NULL,             -- الوصف
  amount REAL NOT NULL,                  -- المبلغ
  payment_method TEXT,                   -- طريقة الدفع
  reference_number TEXT,                 -- رقم المرجع
  batch_id TEXT,                         -- معرف الدفعة (إذا كان مرتبطًا)
  notes TEXT,                            -- ملاحظات
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES inventory(batch_id)
);

-- إنشاء جدول الإشعارات
-- Create notifications table
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,                    -- نوع الإشعار
  title TEXT NOT NULL,                   -- عنوان الإشعار
  message TEXT NOT NULL,                 -- رسالة الإشعار
  related_to TEXT NOT NULL,              -- متعلق بـ (تغذية، لقاح، إلخ)
  reference_id INTEGER,                  -- معرف المرجع
  due_date DATE,                         -- تاريخ الاستحقاق
  status TEXT NOT NULL DEFAULT 'unread', -- الحالة (مقروء، غير مقروء)
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول العدادات
-- Create counters table
CREATE TABLE counters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول سجلات الوصول
-- Create access logs table
CREATE TABLE access_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  path TEXT,
  accessed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء الفهارس لتحسين الأداء
-- Create indexes for performance optimization
CREATE INDEX idx_inventory_batch_id ON inventory(batch_id);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_weight_records_batch_id ON weight_records(batch_id);
CREATE INDEX idx_weight_records_record_date ON weight_records(record_date);
CREATE INDEX idx_feeding_records_batch_id ON feeding_records(batch_id);
CREATE INDEX idx_feeding_records_feed_date ON feeding_records(feed_date);
CREATE INDEX idx_medication_records_batch_id ON medication_records(batch_id);
CREATE INDEX idx_medication_records_next_due_date ON medication_records(next_due_date);
CREATE INDEX idx_sales_records_batch_id ON sales_records(batch_id);
CREATE INDEX idx_sales_records_sale_date ON sales_records(sale_date);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_due_date ON notifications(due_date);
CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX idx_counters_name ON counters(name);

-- إدخال البيانات الأولية
-- Insert initial data
INSERT INTO users (username, password, name, role, email) 
VALUES ('admin', '$2a$10$JfVdOC7WyXRxEMBWgU/Ciu0JUYzrIhgUGqLhzEYCuQTFl5vNJN3rq', 'مدير النظام', 'admin', 'admin@example.com');

INSERT INTO settings (setting_key, setting_value, setting_description) 
VALUES 
  ('farm_name', 'مزرعة الدواجن', 'اسم المزرعة'),
  ('language', 'ar', 'لغة النظام الافتراضية'),
  ('currency', 'SAR', 'العملة الافتراضية'),
  ('notification_enabled', 'true', 'تفعيل الإشعارات');

INSERT INTO counters (name, value) VALUES 
  ('page_views', 0),
  ('api_calls', 0);
