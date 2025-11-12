const Promotion = require("../models/promotionModel");
const { createSlug } = require("../utils/helpers");

// 📦 Lấy toàn bộ promotions (chỉ lấy is_active = true)
exports.getAll = async (req, res) => {
  try {
    const promotions = await Promotion.getAll();
    res.json({
      success: true,
      message: "Lấy danh sách khuyến mãi thành công",
      data: promotions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách khuyến mãi",
      data: null,
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const promotions = await Promotion.getAllAdmin();
    res.json({
      success: true,
      message: "Lấy danh sách khuyến mãi thành công",
      data: promotions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách khuyến mãi",
      data: null,
    });
  }
};

// 📦 Lấy promotion theo ID
exports.getById = async (req, res) => {
  try {
    const promotion = await Promotion.getById(req.params.id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khuyến mãi",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Lấy thông tin khuyến mãi thành công",
      data: promotion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy khuyến mãi",
      data: null,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, blogContent, is_active } = req.body;

    // Kiểm tra ảnh bắt buộc
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Ảnh là bắt buộc!",
        data: null,
      });
    }

    // Chỉ cho phép PNG, JPG, JPEG
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Ảnh chỉ được phép là PNG, JPG hoặc JPEG!",
        data: null,
      });
    }

    // Lưu đường dẫn ảnh
    const imageUrl = `/uploads/${req.file.filename}`;

    // Tạo slug từ tiêu đề
    const slug = createSlug(title);

    // Kiểm tra slug trùng
    const existing = await Promotion.getBySlug(slug);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Slug khuyến mãi đã tồn tại!",
        data: null,
      });
    }

    // Thêm khuyến mãi mới vào DB
    const newPromotion = await Promotion.create({
      title,
      blogContent,
      imageUrl,
      slug,
      is_active,
    });

    // Phản hồi thành công
    res.status(201).json({
      success: true,
      message: "Thêm khuyến mãi thành công",
      data: newPromotion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm khuyến mãi",
      data: null,
    });
  }
};

// ✏️ Cập nhật promotion
exports.update = async (req, res) => {
  try {
    const { title, blogContent, is_active } = req.body;
    const id = req.params.id;

    // Kiểm tra ảnh (có thể bắt buộc hoặc optional tùy bạn)
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Ảnh là bắt buộc!",
        data: null,
      });
    }

    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Ảnh chỉ được phép là PNG, JPG hoặc JPEG!",
        data: null,
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Kiểm tra trùng slug
    const slug = createSlug(title);
    const existing = await Promotion.getBySlug(slug);
    if (existing && existing.id != id) {
      return res.status(400).json({
        success: false,
        message: "Slug khuyến mãi đã tồn tại!",
        data: null,
      });
    }

    const updated = await Promotion.update(id, {
      title,
      blogContent,
      imageUrl,
      slug,
      is_active,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khuyến mãi để cập nhật",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Cập nhật khuyến mãi thành công",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật khuyến mãi",
      data: null,
    });
  }
};

// 🚫 Ẩn khuyến mãi (soft delete)
exports.deactivate = async (req, res) => {
  try {
    const success = await Promotion.deactivate(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khuyến mãi để ẩn",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Ẩn khuyến mãi thành công",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi ẩn khuyến mãi",
      data: null,
    });
  }
};

exports.activate = async (req, res) => {
  try {
    const success = await Promotion.activate(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khuyến mãi để khôi phục",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Khôi phục khuyến mãi thành công",
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi khôi phục khuyến mãi",
      data: null,
    });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const promo = await Promotion.getBySlug(req.params.slug);
    if (!promo) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Không tìm thấy khuyến mãi",
          data: null,
        });
    }
    res.json({
      success: true,
      message: "Lấy khuyến mãi theo slug thành công",
      data: promo,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Lỗi server", data: null });
  }
};
