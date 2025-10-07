const router = require("express").Router();

router.use("/", require("./auth.route"));
// sau này thêm: router.use("/users", require("./users.route"));
// router.use("/orders", require("./orders.route"));

module.exports = router;