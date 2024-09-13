// Create server app
const express = require("express");
const app = express();
const bodyParser = express.json;
const cors = require("cors");

// Database connection
require("./config/db");

// Import routes
const routes = require("./routes");
const messageRoutes = require('./domains/message'); // Ensure this path is correct

// Middleware
app.use(cors());
app.use(express.json()); // Note: `bodyParser` is not used in your code

// Setup routes
app.use('/api/messages', messageRoutes);
app.use('/api', routes);

module.exports = app;
