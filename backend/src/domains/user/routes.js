const express = require("express");
const router = express.Router();
const {
  checkUser,
  registerUser,
  loginUser,
  getUserRole,
} = require("./controller");
const { verifyToken } = require("./../../middleware/auth");

router.post("/check-user", checkUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-role/:id", verifyToken, getUserRole);

module.exports = router;
