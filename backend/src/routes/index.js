const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const pendingAdminsRoutes = require("./../domains/pendingAdmin");
const timeEntryRoutes = require("./../domains/timeEntries");
const otpRoutes = require("./../domains/otp");
const ForgotPasswordRoutes = require("./../domains/forgotPassword");

router.use("/user", userRoutes);
router.use("/pending-admins", pendingAdminsRoutes);
router.use("/time-entries", timeEntryRoutes);
router.use("/otp", otpRoutes);
router.use("/forgot_password", ForgotPasswordRoutes);

module.exports = router;
