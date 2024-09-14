// reportService.js
const TimeEntry = require("./../timeEntries/model");
const sendEmail = require("./../../util/sendEmail");
const { Op } = require("sequelize");

const generateDailyReport = async (userId) => {
  try {
    // Fetch the user's time entries and tasks for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const timeEntries = await TimeEntry.findAll({
      where: {
        user_id: userId,
        date: { [Op.gte]: startOfDay },
      },
    });

    // Generate a summary report
    let reportText = `Daily Report for ${new Date().toLocaleDateString()}\n\nTime Entries:\n`;
    timeEntries.forEach((entry) => {
      reportText += `- ${entry.activity}: ${entry.duration} hours\n`;
    });

    return reportText;
  } catch (error) {
    console.error("Error generating report:", error);
    throw error;
  }
};

const sendDailyReport = async (user) => {
  try {
    const report = await generateDailyReport(user.id);
    await sendEmail(user.email, "Your Daily Report", report);
    console.log("Daily report sent to:", user.email);
  } catch (error) {
    console.error("Error sending daily report:", error);
  }
};

module.exports = { sendDailyReport };
