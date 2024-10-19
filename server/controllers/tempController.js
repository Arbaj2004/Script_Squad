const sendSMS = require('../utils/otp');

exports.sendSms = async (req, res) => {
    const { message, phoneNumber } = req.body;

    // Validate input
    if (!message || !phoneNumber) {
        return res.status(400).json({ error: 'Message and phone number are required.' });
    }

    try {
        await sendSMS({ message, phoneNumber });
        return res.status(200).json({ message: 'SMS sent successfully!' });
    } catch (error) {
        console.error('Error sending SMS:', error);
        return res.status(500).json({ error: 'Failed to send SMS.' });
    }
};
