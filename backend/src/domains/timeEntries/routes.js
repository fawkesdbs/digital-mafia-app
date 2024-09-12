const express = require("express");
const router = express.Router();
// const mysql = require("mysql2");
// const jwt = require("jsonwebtoken");
const {
  checkUser,
  registerUser,
  loginUser,
  getUserRole,
  getPendingAdmins,
  approveAdmin,
  rejectAdmin,
} = require("./controller");
const { verifyToken, checkAdmin } = require("./../../middleware/auth");
// const {
//   databaseExists,
//   createInitialConnection,
// } = require("./../../util/createDBConnection");
// const { DB_PASSWORD } = process.env;

// const connectDB = async (dbName) => {
//   const connection = await createInitialConnection();

//   try {
//     const exists = await databaseExists(connection, dbName);
//     if (exists) {
//       const db = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         password: DB_PASSWORD,
//         database: dbName,
//       });
//       console.log(`Connecting to "${dbName}" database...`);

//       return db;
//     }
//   } catch (error) {
//     console.error("Error connecting to database:", error);
//     throw error;
//   }
// };

// Check if user exists by email
router.post("/check-user", checkUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-role", verifyToken, getUserRole);
router.get("/pending-admins", verifyToken, checkAdmin, getPendingAdmins);
router.put("/approve-admin/:adminId", verifyToken, checkAdmin, approveAdmin);
router.delete("/reject-admin/:adminId", verifyToken, checkAdmin, rejectAdmin);

module.exports = router;
