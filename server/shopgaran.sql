CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  slug VARCHAR(255) UNIQUE,
  image_url VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  priority INT DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  original_price DECIMAL(12,2) NOT NULL,
  sale_price DECIMAL(12,2),
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE addon_groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(255),
  description TEXT,
  note TEXT,
  min_total_quantity INT DEFAULT 1,
  max_total_quantity INT DEFAULT 1,
  priority INT DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE addon_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  addon_group_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  max_quantity INT DEFAULT 1,
  min_quantity INT DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 0,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (addon_group_id) REFERENCES addon_groups(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS vouchers (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,                 -- Mã voucher (SALE10, FREESHIP)
  name VARCHAR(255) DEFAULT NULL,                   -- Tên hiển thị (Giảm 10%, Freeship)
  description TEXT DEFAULT NULL,                    -- Mô tả chi tiết

  discount_type ENUM('percent', 'fixed') DEFAULT 'percent',  -- Loại giảm giá
  discount_value DECIMAL(10,2) NOT NULL,            -- Giá trị giảm (% hoặc số tiền)
  min_order_value DECIMAL(12,2) DEFAULT 0,          -- Giá trị đơn hàng tối thiểu
  max_discount_value DECIMAL(12,2) DEFAULT NULL,    -- Giới hạn giảm tối đa (nếu là %)
  
  quantity INT DEFAULT 100,                         -- Số lượng mã phát hành
  used_count INT DEFAULT 0,                         -- Đã dùng bao nhiêu lần

  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,    -- Bắt đầu hiệu lực
  end_date DATETIME DEFAULT NULL,                   -- Hết hiệu lực
  is_active BOOLEAN DEFAULT TRUE,                   -- Còn hoạt động hay không

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS voucher_products (
  voucher_id INT NOT NULL,
  product_id INT NOT NULL,
  PRIMARY KEY (voucher_id, product_id),

  FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

