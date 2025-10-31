const Group = require("../models/addonGroupModel");

exports.getAll = async (req, res) => {
    const data = await Group.getAll();
    res.json({ success: true, message: "Lấy danh sách nhóm addon", data });
};

exports.getById = async (req, res) => {
    const item = await Group.getById(req.params.id);
    if (!item)
        return res
            .status(404)
            .json({
                success: false,
                message: "Không tìm thấy nhóm addon",
                data: null,
            });
    res.json({
        success: true,
        message: "Lấy nhóm addon thành công",
        data: item,
    });
};

exports.getByProduct = async (req, res) => {
    const data = await Group.getByProduct(req.params.product_id);
    res.json({ success: true, message: "Lấy nhóm addon theo sản phẩm", data });
};

exports.create = async (req, res) => {
    const newGroup = await Group.create(req.body);
    res.status(201).json({
        success: true,
        message: "Thêm nhóm addon thành công",
        data: newGroup,
    });
};

exports.update = async (req, res) => {
    const updated = await Group.update(req.params.id, req.body);
    if (!updated)
        return res
            .status(404)
            .json({
                success: false,
                message: "Không tìm thấy nhóm addon để cập nhật",
                data: null,
            });
    res.json({ success: true, message: "Cập nhật nhóm addon thành công" });
};

exports.remove = async (req, res) => {
    const deleted = await Group.remove(req.params.id);
    if (!deleted)
        return res
            .status(404)
            .json({
                success: false,
                message: "Không tìm thấy nhóm addon để xoá",
                data: null,
            });
    res.json({ success: true, message: "Xoá nhóm addon thành công" });
};
