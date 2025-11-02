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



-- INSERT INTO categories (name, description, slug, image_url, is_active, priority) VALUES
-- ('Ưu đãi hôm nay', 'Khuyến mãi', 'khuyen-mai', 'https://api.popeyes.vn/api/v1/files/06012023_150400_ud.png', 1, 100),
-- ('Món mới', 'Món mới', 'mon-moi', 'https://api.popeyes.vn/api/v1/files/06012023_151905_nd.png', 1, 99),
-- ('Gà giòn', 'Gà giòn', 'ga-gion', 'https://api.popeyes.vn/api/v1/files/06012023_150655_gd.png', 1, 98),
-- ('Gà Xốt Phô Mai', 'Gà Xốt Phô Mai', 'ga-xot-pho-mai', 'https://api.popeyes.vn/api/v1/files/06012023_150655_gd.png', 1, 97),
-- ('Gà tắm nước mắm', 'Gà tắm nước mắm', 'ga-tam-nuoc-mam', 'https://api.popeyes.vn/api/v1/files/28042022_065454_loaigatamnuocmamactiveno.png', 1, 96),
-- ('Pop Wings', 'Pop Wings', 'pop-wings', 'https://api.popeyes.vn/api/v1/files/iconpopwingsblack.png', 1, 95),
-- ('Gà Không Xương', 'Gà Không Xương', 'ga-khong-xuong', 'https://api.popeyes.vn/api/v1/files/06012023_151930_kxd.png', 1, 94),
-- ('Mì Ý Và Cơm', 'Cơm Và Mì Ý', 'mi-y-va-com', 'https://api.popeyes.vn/api/v1/files/06012023_151959_yd.png', 1, 93),
-- ('Burger', 'Burger', 'burger', 'https://api.popeyes.vn/api/v1/files/06012023_152016_bd.png', 1, 92),
-- ('Combo Gia Đình', 'Combo khuyến mãi', 'combo-gia-dinh', 'https://api.popeyes.vn/api/v1/files/06012023_152041_cd.png', 1, 91),
-- ('Kid Meals', 'Kid Meals', 'kid-meals', 'https://api.popeyes.vn/api/v1/files/28042022_065906_loaicombokidsactiveno.png', 1, 90),
-- ('Gà và Hải Sản', 'Surf and Turf', 'ga-va-hai-san', 'https://api.popeyes.vn/api/v1/files/28042022_065800_loaisurfandturfactiveno.png', 1, 89),
-- ('Thức uống', 'Thức uống', 'thuc-uong', 'https://api.popeyes.vn/api/v1/files/06012023_152121_td.png', 1, 88),
-- ('Món ăn kèm', 'Món ăn kèm', 'mon-an-kem', 'https://api.popeyes.vn/api/v1/files/06012023_152103_kd.png', 1, 87),
-- ('Mì Ý Phô Mai & Soda', 'Mì Ý Phô Mai & Soda', 'mi-y-pho-mai-soda', 'https://api.popeyes.vn/api/v1/files/06012023_151959_yd.png', 1, 1);

-- INSERT INTO products (name, slug, original_price, sale_price, description, image_url, is_active, priority) VALUES
-- ('Thứ 5 Mua 1 tặng 1 [Mì Ý Premium] - 84.000đ', 'thu-5-mua-1-tang-1-mi-y-premium-84000d', 121000, 84000, 'Phần ăn gồm: 01 Mì Ý Phô Mai Premium (Gà Không Xương/Donut Tôm) + 01 Miếng Gà Giòn (Cay/Không cay) + 01 nước ngọt chỉ 84,000đ (Giảm khi thêm giỏ hàng)', 'https://api.popeyes.vn/api/v1/files/SpaBOGOT3T5Cb1ng84k_1x1.jpg', 1, 100),
-- ('Thứ 5 Mua 1 tặng 1 [Mì Ý Popcorn] - 70,000đ', 'thu-5-mua-1-tang-1-mi-y-popcorn-70000d', 107000, 70000, 'Phần ăn gồm: 01 Mì Ý Popcorn + 01 Miếng Gà Giòn (Cay/Không cay) + 01 nước ngọt chỉ 70,000đ (Giảm khi thêm giỏ hàng)', 'https://api.popeyes.vn/api/v1/files/SpaBOGOT3T5Cb1ng70k_1x1.jpg', 1, 100),
-- ('Thứ 5 Mua 1 tặng 1 [Mì Ý Phô Mai] - 60.000đ', 'thu-5-mua-1-tang-1-mi-y-pho-mai-60000d', 97000, 60000, 'Phần ăn gồm: 01 Mì Ý Phô Mai + 01 Miếng Gà Giòn (Cay/Không cay) + 1 nước ngọt chỉ 60,000đ (Giảm khi thêm giỏ hàng)', 'https://api.popeyes.vn/api/v1/files/SpaBOGOT3T5Cb1ng60k_1x1.jpg', 1, 100),
-- ('Thứ 3 Mua 1 tặng 1 [Mì Ý Premium] - 84.000đ', 'thu-3-mua-1-tang-1-mi-y-premium-84000d', 121000, 84000, 'Phần ăn gồm: 01 Mì Ý Phô Mai Premium (Gà Không Xương/Donut Tôm) + 01 Miếng Gà Giòn (Cay/Không cay) + 01 nước ngọt chỉ 84,000đ (Giảm khi thêm giỏ hàng)', 'https://api.popeyes.vn/api/v1/files/SpaBOGOT3T5Cb1ng84k_1x1.jpg', 1, 100),
-- ('Combo Gà Giòn 7 món - 99.000đ', 'combo-ga-gion-7-mon-99000d', 167000, 99000, 'Phần ăn gồm: 02 Gà Giòn + 02 Spicy Wings + 01 Khoai Tây Chiên (S) + 02 Nước Ngọt (Giảm khi thêm giỏ hàng)', 'https://api.popeyes.vn/api/v1/files/NewMG_Ph5BICver_11.jpg', 1, 99),
-- ('Combo Gà Không Xương - 75.000đ', 'combo-ga-khong-xuong-75000d', 115000, 75000, 'Phần ăn gồm: 02 Gà Không Xương + 01 Khoai Tây Chiên (S) + 01 Nước Ngọt', 'https://api.popeyes.vn/api/v1/files/combo-ga-khong-xuong.jpg', 1, 98),
-- ('Burger Gà Giòn - 45.000đ', 'burger-ga-gion-45000d', 45000, NULL, 'Burger với gà giòn cay, rau sốt tươi ngon', 'https://api.popeyes.vn/api/v1/files/burger-ga-gion.jpg', 1, 95),
-- ('Cơm Gà Sốt Teriyaki - 55.000đ', 'com-ga-sot-teriyaki-55000d', 55000, NULL, 'Cơm trắng với gà sốt teriyaki thơm ngon', 'https://api.popeyes.vn/api/v1/files/com-ga-teriyaki.jpg', 1, 90),
-- ('Khoai Tây Chiên Lắc Phô Mai - 35.000đ', 'khoai-tay-chien-lac-pho-mai-35000d', 35000, NULL, 'Khoai tây chiên giòn lắc phô mai thơm ngon', 'https://api.popeyes.vn/api/v1/files/khoai-tay-lac-pho-mai.jpg', 1, 85),
-- ('Coca Cola - 20.000đ', 'coca-cola-20000d', 20000, NULL, 'Nước ngọt Coca Cola', 'https://api.popeyes.vn/api/v1/files/coca-cola.jpg', 1, 80);