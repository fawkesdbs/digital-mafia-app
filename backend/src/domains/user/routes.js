const express = require("express");
const router = express.Router();
const {
  checkUser,
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUserRole,
} = require("./controller");
const { verifyToken } = require("./../../middleware/auth");

router.post("/check-user", checkUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-role/:id", verifyToken, getUserRole);
router.get("/profile/:id", verifyToken, getProfile);
router.put("/profile/:id", verifyToken, updateProfile);

module.exports = router;
