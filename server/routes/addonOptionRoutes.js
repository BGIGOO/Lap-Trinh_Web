const express = require("express");
const router = express.Router();
const optionController = require("../controllers/addonOptionController");
const {
    validateCreateAddonOption,
    validateUpdateAddonOption,
} = require("../middlewares/addonOptionValidator");
const { handleValidation } = require("../middlewares/validateResult");

router.get("/", optionController.getAll);
router.get("/:id", optionController.getById);
router.get("/group/:group_id", optionController.getByGroup);
router.post(
    "/",
    validateCreateAddonOption,
    handleValidation,
    optionController.create
);
router.put(
    "/:id",
    validateUpdateAddonOption,
    handleValidation,
    optionController.update
);
router.delete("/:id", optionController.remove);

module.exports = router;
