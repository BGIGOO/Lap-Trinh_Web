const Category = require("../models/categoryModel");
const slugify = require("slugify");

// Lấy tất cả danh mục
exports.getAll = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.json({
            success: true,
            message: "Lấy danh sách danh mục thành công",
            data: categories,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh mục",
            data: null,
        });
    }
};

// Tạo danh mục
exports.create = async (req, res) => {
    try {
        const { name, description, is_active, priority } = req.body;

        // Kiểm tra ảnh bắt buộc
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

        const slug = slugify(name, { lower: true });
        const existing = await Category.getBySlug(slug);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Slug danh mục đã tồn tại!",
                data: null,
            });
        }

        const image_url = `/uploads/${req.file.filename}`;
        const newCategory = await Category.create({
            name,
            description,
            slug,
            image_url,
            is_active,
            priority,
        });

        return res.status(201).json({
            success: true,
            message: "Thêm danh mục thành công!",
            data: newCategory,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi thêm danh mục!",
            data: null,
        });
    }
};

// Cập nhật danh mục
exports.update = async (req, res) => {
    try {
        const { name, description, is_active, priority } = req.body;
        const id = req.params.id;

        // Kiểm tra ảnh bắt buộc
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Ảnh là bắt buộc!",
                data: null,
            });
        }

        const old = await Category.getById(id);
        if (!old) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy danh mục cần cập nhật!",
                data: null,
            });
        }

        const slug = slugify(name, { lower: true });
        const existing = await Category.getBySlug(slug);
        if (existing && existing.id != id) {
            return res.status(400).json({
                success: false,
                message: "Slug danh mục đã tồn tại!",
                data: null,
            });
        }

        let image_url = old.image_url;
        if (req.file) {
            const allowed = ["image/png", "image/jpeg", "image/jpg"];
            if (!allowed.includes(req.file.mimetype)) {
                return res.status(400).json({
                    success: false,
                    message: "Ảnh chỉ được phép là PNG, JPG hoặc JPEG!",
                    data: null,
                });
            }
            image_url = `/uploads/${req.file.filename}`;
        }

        const updated = await Category.update(id, {
            name,
            description,
            slug,
            image_url,
            is_active,
            priority,
        });
        if (!updated) {
            return res.status(500).json({
                success: false,
                message: "Không thể cập nhật danh mục!",
                data: null,
            });
        }

        res.json({
            success: true,
            message: "Cập nhật danh mục thành công!",
            data: {
                id,
                name,
                description,
                slug,
                image_url,
                is_active,
                priority,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật danh mục!",
            data: null,
        });
    }
};
