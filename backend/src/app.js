// mongodb
const { sequelize } = require("./config/db");

const cron = require("node-cron");
const { sendDailyReport } = require("./domains/summaryEmail/controller");
const User = require("./domains/user/model");

const express = require("express");
const bodyParser = express.json;
const cors = require("cors");
const routes = require("./routes");

// create server app
const app = express();

app.use(cors());
app.use(bodyParser());
app.use("/api", routes);

// Schedule a cron job to run every day at 4 PM
cron.schedule("0 16 * * *", async () => {
  try {
    const users = await User.findAll(); // Fetch all users
    users.forEach((user) => {
      sendDailyReport(user);
    });
  } catch (error) {
    console.error("Error scheduling daily reports:", error);
  }
});

module.exports = app;
