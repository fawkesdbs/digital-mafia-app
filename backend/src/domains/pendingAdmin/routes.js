const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin,
} = require("./controller");
const { verifyToken, checkAdmin } = require("./../../middleware/auth");

router.post("/register", registerAdmin);
router.get("/", verifyToken, checkAdmin, getPendingAdmins);
router.put("/approve-admin/:adminId", verifyToken, checkAdmin, approveAdmin);
router.delete("/reject-admin/:adminId", verifyToken, checkAdmin, rejectAdmin);

module.exports = router;
