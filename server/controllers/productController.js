const Product = require("../models/productModel");
const Group = require("../models/addonGroupModel");
const Option = require("../models/addonOptionModel");
const { createSlug } = require("../utils/helpers");

exports.getAll = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json({
            success: true,
            message: "Lấy danh sách sản phẩm thành công",
            data: products,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            data: null,
        });
    }
};

exports.getByCategory = async (req, res) => {
    const data = await Product.getByCategory(req.params.category_id);
    res.json({ success: true, message: "Lấy sản phẩm theo danh mục", data });
};

exports.getById = async (req, res) => {
    try {
        // Lấy sản phẩm theo ID
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm",
                data: null,
            });
        }

        // Lấy các nhóm addon theo product_id
        const groups = await Group.getByProduct(product.id);

        // Gắn các tùy chọn (options) vào từng nhóm
        for (const group of groups) {
            const options = await Option.getByGroup(group.id);
            group.options = options;
        }

        // Chuẩn hóa field cho JSON trả về
        const formatted = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.original_price,
            sale_price: product.sale_price,
            description: product.description,
            image_url: product.image_url,
            isActive: product.is_active === 1 || product.is_active === true,
            priority: product.priority,
            addOns: groups,
        };

        res.json({
            success: true,
            message: "Lấy sản phẩm và addon thành công",
            data: formatted,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy sản phẩm",
            data: null,
        });
    }
};

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

        const image_url = `/uploads/${req.file.filename}`;

        const slug = createSlug(name);
        const existing = await Product.getBySlug(slug);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Slug sản phẩm đã tồn tại!",
                data: null,
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

exports.update = async (req, res) => {
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
        const id = req.params.id;

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

        const image_url = `/uploads/${req.file.filename}`;

        const slug = createSlug(name);
        const existing = await Product.getBySlug(slug);
        if (existing && existing.id != id) {
            return res.status(400).json({
                success: false,
                message: "Slug sản phẩm đã tồn tại!",
                data: null,
            });
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

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm để cập nhật",
                data: null,
            });
        }

        res.json({
            success: true,
            message: "Cập nhật sản phẩm thành công",
            data: null,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật sản phẩm",
            data: null,
        });
    }
};
