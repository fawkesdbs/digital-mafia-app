const express = require("express");
const router = express.Router();
const {
  createTimeEntry,
  getTimeEntries,
  updateTimeEntry,
  deleteTimeEntry,
} = require("./controller");
const { verifyToken } = require("../../middleware/auth");

router.post("/", verifyToken, createTimeEntry);
router.get("/", verifyToken, getTimeEntries);
router.put("/:id", verifyToken, updateTimeEntry);
router.delete("/:id", verifyToken, deleteTimeEntry);

module.exports = router;
