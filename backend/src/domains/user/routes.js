const express = require("express");
const router = express.Router();
const {
  checkUser,
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getUserRole,
  getUsers,
} = require("./controller");
const { verifyToken, checkAdmin } = require("./../../middleware/auth");

router.post("/check-user", checkUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-role/:id", verifyToken, getUserRole);
router.get("/profile/:id", verifyToken, getProfile);
router.put("/profile/:id", verifyToken, updateProfile);
router.get("/users", verifyToken, getUsers);

module.exports = router;
