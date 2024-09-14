// routes.js
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
  registerWithGoogle,
} = require("./controller");
const { verifyToken, checkAdmin } = require("./../../middleware/auth");

// Existing routes
router.post("/check-user", checkUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-role/:id", verifyToken, getUserRole);
router.get("/profile/:id", verifyToken, getProfile);
router.put("/profile/:id", verifyToken, updateProfile);
router.get("/users", verifyToken, checkAdmin, getUsers);
router.post("/register-google", registerWithGoogle);

module.exports = router;
