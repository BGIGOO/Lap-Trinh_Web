const Option = require("../models/addonOptionModel");

exports.getAll = async (req, res) => {
    const data = await Option.getAll();
    res.json({ success: true, message: "Lấy danh sách tùy chọn addon", data });
};

exports.getByGroup = async (req, res) => {
    const data = await Option.getByGroup(req.params.group_id);
    res.json({ success: true, message: "Lấy tùy chọn theo nhóm addon", data });
};

exports.getById = async (req, res) => {
    const item = await Option.getById(req.params.id);
    if (!item)
        return res
            .status(404)
            .json({
                success: false,
                message: "Không tìm thấy tùy chọn addon",
                data: null,
            });
    res.json({
        success: true,
        message: "Lấy tùy chọn addon thành công",
        data: item,
    });
};

exports.create = async (req, res) => {
    const newOption = await Option.create(req.body);
    res.status(201).json({
        success: true,
        message: "Thêm tùy chọn addon thành công",
        data: newOption,
    });
};

exports.update = async (req, res) => {
    const updated = await Option.update(req.params.id, req.body);
    if (!updated)
        return res
            .status(404)
            .json({
                success: false,
                message: "Không tìm thấy tùy chọn để cập nhật",
                data: null,
            });
    res.json({ success: true, message: "Cập nhật tùy chọn addon thành công" });
};

exports.remove = async (req, res) => {
    const deleted = await Option.remove(req.params.id);
    if (!deleted)
        return res
            .status(404)
            .json({
                success: false,
                message: "Không tìm thấy tùy chọn để xoá",
                data: null,
            });
    res.json({ success: true, message: "Xoá tùy chọn addon thành công" });
};
