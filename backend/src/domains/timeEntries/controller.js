const TimeEntry = require("./model");
const { Op } = require("sequelize");

// Utility function to validate if the time entry date is not in the future
const isValidTimeEntry = (date) => {
  const entryDate = new Date(date);
  const currentDate = new Date();
  return entryDate <= currentDate;
};

// Create or update a time entry
const createTimeEntry = async (req, res) => {
  const { type, date, hours, description } = req.body;
  const userId = req.user.id; // Assuming user ID is available from authentication

  if (type === 'log' && !isValidTimeEntry(date)) {
    return res.status(400).json("Cannot log time for the future.");
  }

  try {
    let timeEntry = await TimeEntry.findOne({
      where: { user_id: userId, date },
    });

    if (timeEntry) {
      // Validate before updating
      if (type === 'log' && !isValidTimeEntry(date)) {
        return res.status(400).json("Cannot update time entry for the future.");
      }

      // Update existing entry
      timeEntry.hours = hours;
      timeEntry.description = description;
      await timeEntry.save();
    } else {
      // Create new entry
      timeEntry = await TimeEntry.create({
        user_id: userId,
        date,
        hours,
        description,
        type,
      });
    }

    return res.status(200).json(timeEntry);
  } catch (error) {
    console.error("Error creating time entry:", error);
    return res.status(500).json("Error processing your request.");
  }
};

// Get time entries within a date range
const getTimeEntries = async (req, res) => {
  const { userId, startDate, endDate } = req.query;

  try {
    const timeEntries = await TimeEntry.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return res.status(200).json(timeEntries);
  } catch (error) {
    console.error("Error retrieving time entries:", error);
    return res.status(500).json("Error retrieving time entries.");
  }
};

// Update an existing time entry
const updateTimeEntry = async (req, res) => {
  const { id } = req.params;
  const { hours, description, type } = req.body;

  try {
    const timeEntry = await TimeEntry.findByPk(id);

    if (!timeEntry) {
      return res.status(404).json("Time entry not found.");
    }

    // Validate before updating
    if (type === 'log' && !isValidTimeEntry(timeEntry.date)) {
      return res.status(400).json("Cannot update time entry for the future.");
    }

    timeEntry.hours = hours;
    timeEntry.description = description;
    await timeEntry.save();

    return res.status(200).json(timeEntry);
  } catch (error) {
    console.error("Error updating time entry:", error);
    return res.status(500).json("Error updating time entry.");
  }
};

// Delete a time entry
const deleteTimeEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const timeEntry = await TimeEntry.findByPk(id);

    if (!timeEntry) {
      return res.status(404).json("Time entry not found.");
    }

    // Validate before deleting
    if (timeEntry.type === 'log' && !isValidTimeEntry(timeEntry.date)) {
      return res.status(400).json("Cannot delete time entry for the future.");
    }

    await timeEntry.destroy();
    return res.status(204).send(); // Use send() to end the response
  } catch (error) {
    console.error("Error deleting time entry:", error);
    return res.status(500).json("Error deleting time entry.");
  }
};

module.exports = {
  createTimeEntry,
  getTimeEntries,
  updateTimeEntry,
  deleteTimeEntry,
};
