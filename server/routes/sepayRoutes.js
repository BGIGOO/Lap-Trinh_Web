const express = require("express");
const router = express.Router();
const sepayController = require("../controllers/sepayController");

router.post("/callback", sepayController.sepayCallback);

module.exports = router;
