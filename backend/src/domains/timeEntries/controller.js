const TimeEntry = require("./model");
const { Op } = require("sequelize");
const moment = require("moment");
const { isValidTimeEntry } = require("../../util/validTimeEntry");

const createTimeEntry = async (req, res) => {
  const { date, hours, description } = req.body;
  const userId = req.user.id; // Assuming user ID is available from authentication

  if (!isValidTimeEntry(date)) {
    return res.status(400).json("Cannot log time for the future.");
  }

  try {
    let timeEntry = await TimeEntry.findOne({
      where: { user_id: userId, date },
    });

    if (timeEntry) {
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
      });
    }

    return res.status(200).json(timeEntry);
  } catch (error) {
    return res.status(500).json("Error processing your request.");
  }
};

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
    return res.status(500).json("Error retrieving time entries.");
  }
};

const updateTimeEntry = async (req, res) => {
  const { id } = req.params;
  const { hours, description } = req.body;

  try {
    const timeEntry = await TimeEntry.findByPk(id);

    if (!timeEntry) {
      return res.status(404).json("Time entry not found.");
    }

    if (!isValidTimeEntry(timeEntry.date)) {
      return res.status(400).json("Cannot update time entry for the future.");
    }

    timeEntry.hours = hours;
    timeEntry.description = description;
    await timeEntry.save();

    res.json(timeEntry);
  } catch (error) {
    res.status(500).json("Error updating time entry.");
  }
};

const deleteTimeEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const timeEntry = await TimeEntry.findByPk(id);

    if (!timeEntry) {
      return res.status(404).json("Time entry not found.");
    }

    if (!isValidTimeEntry(timeEntry.date)) {
      return res.status(400).json("Cannot delete time entry for the future.");
    }

    await timeEntry.destroy();
    res.jsonStatus(204);
  } catch (error) {
    res.status(500).json("Error deleting time entry.");
  }
};

module.exports = {
  createTimeEntry,
  getTimeEntries,
  updateTimeEntry,
  deleteTimeEntry,
};
