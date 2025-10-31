const express = require("express");
const router = express.Router();
const groupController = require("../controllers/addonGroupController");
const {
    validateCreateAddonGroup,
    validateUpdateAddonGroup,
} = require("../middlewares/addonGroupValidator");
const { handleValidation } = require("../middlewares/validateResult");

router.get("/", groupController.getAll);
router.get("/:id", groupController.getById);
router.get("/product/:product_id", groupController.getByProduct);
router.post(
    "/",
    validateCreateAddonGroup,
    handleValidation,
    groupController.create
);
router.put(
    "/:id",
    validateUpdateAddonGroup,
    handleValidation,
    groupController.update
);
router.delete("/:id", groupController.remove);

module.exports = router;
