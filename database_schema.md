# مخطط قاعدة البيانات لنظام إدارة مزرعة الدواجن
# Database Schema for Poultry Farm Management System

## جداول قاعدة البيانات (Database Tables)

### 1. جدول المخزون (Inventory Table)
```sql
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL,                -- معرف الدفعة
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
```

### 2. جدول سجلات الوزن والنمو (Weight and Growth Records Table)
```sql
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
```

### 3. جدول سجلات التغذية (Feeding Records Table)
```sql
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
```

### 4. جدول سجلات الأدوية واللقاحات (Medication and Vaccination Records Table)
```sql
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
```

### 5. جدول سجلات المبيعات والإيرادات (Sales and Revenue Records Table)
```sql
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
```

### 6. جدول معلومات الموظفين (Employee Information Table)
```sql
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
```

### 7. جدول النفقات والتكاليف (Expenses and Costs Table)
```sql
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
```

### 8. جدول الإشعارات (Notifications Table)
```sql
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
```

### 9. جدول المستخدمين (Users Table)
```sql
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
```

### 10. جدول إعدادات النظام (Settings Table)
```sql
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  setting_key TEXT NOT NULL UNIQUE,      -- مفتاح الإعداد
  setting_value TEXT NOT NULL,           -- قيمة الإعداد
  setting_description TEXT,              -- وصف الإعداد
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## العلاقات بين الجداول (Table Relationships)

1. جدول المخزون (inventory) هو الجدول الرئيسي الذي يرتبط به معظم الجداول الأخرى من خلال batch_id.
2. جداول سجلات الوزن (weight_records)، سجلات التغذية (feeding_records)، سجلات الأدوية (medication_records)، وسجلات المبيعات (sales_records) ترتبط جميعها بجدول المخزون.
3. جدول النفقات (expenses) يمكن أن يرتبط اختياريًا بجدول المخزون إذا كانت النفقة متعلقة بدفعة معينة.
4. جدول الإشعارات (notifications) يمكن أن يرتبط بأي جدول آخر من خلال reference_id و related_to.

## الفهارس (Indexes)

```sql
-- فهارس لتحسين الأداء
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
```

## البيانات الأولية (Initial Data)

```sql
-- إدخال بيانات المستخدم الافتراضي
INSERT INTO users (username, password, name, role, email) 
VALUES ('admin', '$2a$10$JfVdOC7WyXRxEMBWgU/Ciu0JUYzrIhgUGqLhzEYCuQTFl5vNJN3rq', 'مدير النظام', 'admin', 'admin@example.com');

-- إدخال إعدادات النظام الافتراضية
INSERT INTO settings (setting_key, setting_value, setting_description) 
VALUES 
  ('farm_name', 'مزرعة الدواجن', 'اسم المزرعة'),
  ('language', 'ar', 'لغة النظام الافتراضية'),
  ('currency', 'SAR', 'العملة الافتراضية'),
  ('notification_enabled', 'true', 'تفعيل الإشعارات');
```
