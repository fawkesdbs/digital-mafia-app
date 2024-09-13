const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const pendingAdminsRoutes = require("./../domains/pendingAdmin");
const timeEntryRoutes = require("./../domains/timeEntries");

router.use("/user", userRoutes);
router.use("/pending-admins", pendingAdminsRoutes);
router.use("/time-entries", timeEntryRoutes);

module.exports = router;
