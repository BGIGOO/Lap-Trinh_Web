const express = require("express");
const router = express.Router();
const { voucherValidator } = require("../middlewares/voucherValidator");
const { handleValidation } = require("../middlewares/validateResult");
const voucherController = require("../controllers/voucherController");

router.get("/", voucherController.getAll);
router.get("/:id", voucherController.getById);
router.post("/", voucherValidator, handleValidation, voucherController.create);
router.put(
    "/:id",
    voucherValidator,
    handleValidation,
    voucherController.update
);
router.delete("/:id", voucherController.delete);
router.post("/apply", voucherController.apply);

module.exports = router;
