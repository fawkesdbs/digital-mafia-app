const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const pendingAdminsRoutes = require("./../domains/pendingAdmin");

router.use("/user", userRoutes);
router.use("/pending-admins", pendingAdminsRoutes);

module.exports = router;
