const express = require('express');
const router = express.Router();
const smsController = require('../controllers/tempController');

// Route to send SMS
router.post('/send-sms', smsController.sendSms);

module.exports = router;
