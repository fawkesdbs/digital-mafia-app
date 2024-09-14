const express = require("express");
const { createTask, getAllTasks } = require("./controller");

const router = express.Router();

router.post("/", createTask);
router.get("/tasks", getAllTasks);

module.exports = router;
