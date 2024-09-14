const Task = require("./model");

const createTask = async (req, res) => {
  try {
    const { title, description, startDate, endDate, priority, userRole } =
      req.body;
    if (!(title && startDate && endDate && priority && userRole)) {
      return res.status(400).json({
        message:
          "Title, Start Date, and End Date, Priority, and User Role are required.",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      startDate,
      endDate,
      priority,
      userRole,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll();

    res.json({
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getAllTasks };
