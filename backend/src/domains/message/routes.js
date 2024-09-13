const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('./controller');

// Route to send a new message
router.post('/send', sendMessage);

// Route to get messages between two users
router.get('/private/:userId', getMessages);

module.exports = router;
