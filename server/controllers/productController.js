const Product = require("../models/productModel");
const Group = require("../models/addonGroupModel");
const Option = require("../models/addonOptionModel");
const { createSlug } = require("../utils/helpers");

// ===============================
//   GET ALL PRODUCTS
// ===============================
exports.getAll = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server", data: null });
  }
};

// ===============================
//   GET BY CATEGORY
// ===============================
exports.getByCategory = async (req, res) => {
  try {
    const data = await Product.getByCategory(req.params.category_id);
    res.json({ success: true, message: "Lấy sản phẩm theo danh mục", data });
  } catch {
    res.status(500).json({ success: false, message: "Lỗi server", data: null });
  }
};

// ===============================
//   GET PRODUCT + ADDONS
// ===============================
exports.getById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });

    const groups = await Group.getByProduct(product.id);

    for (const group of groups) {
      group.options = await Option.getByGroup(group.id);
    }

    const formatted = {
      ...product,
      isActive: !!product.is_active,
      addOns: groups,
    };

    res.json({
      success: true,
      message: "Lấy sản phẩm thành công",
      data: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server", data: null });
  }
};

// Validate ảnh upload
const validateImageFile = (file) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  return allowed.includes(file?.mimetype);
};

// ===============================
//   CREATE PRODUCT — ẢNH BẮT BUỘC
// ===============================
exports.create = async (req, res) => {
  try {
    const {
      category_id,
      name,
      original_price,
      sale_price,
      description,
      is_active,
      priority,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Ảnh là bắt buộc!",
      });
    }

    if (!validateImageFile(req.file)) {
      return res.status(400).json({
        success: false,
        message: "Ảnh chỉ được phép là PNG, JPG hoặc JPEG!",
      });
    }

    const image_url = `/uploads/${req.file.filename}`;
    const slug = createSlug(name);

    const existing = await Product.getBySlug(slug);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug sản phẩm đã tồn tại!",
      });
    }

    const newProduct = await Product.create({
      category_id,
      name,
      slug,
      original_price,
      sale_price,
      description,
      image_url,
      is_active,
      priority,
    });

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm sản phẩm",
      data: null,
    });
  }
};

// ===============================
//   UPDATE PRODUCT — ẢNH KHÔNG BẮT BUỘC
// ===============================
exports.update = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      category_id,
      name,
      original_price,
      sale_price,
      description,
      is_active,
      priority,
    } = req.body;

    // Kiểm tra xem sản phẩm có tồn tại không
    const oldProduct = await Product.getById(id);
    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm để cập nhật",
      });
    }

    // Slug mới
    const slug = createSlug(name);

    // Kiểm tra trùng slug
    const existing = await Product.getBySlug(slug);
    if (existing && existing.id != id) {
      return res.status(400).json({
        success: false,
        message: "Slug sản phẩm đã tồn tại!",
      });
    }

    // Xử lý ảnh: nếu có file => ảnh mới, nếu không => giữ ảnh cũ
    let image_url = oldProduct.image_url;

    if (req.file) {
      if (!validateImageFile(req.file)) {
        return res.status(400).json({
          success: false,
          message: "Ảnh chỉ được phép là PNG, JPG hoặc JPEG!",
        });
      }
      image_url = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.update(id, {
      category_id,
      name,
      slug,
      original_price,
      sale_price,
      description,
      image_url,
      is_active,
      priority,
    });

    res.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật sản phẩm",
    });
  }
};
