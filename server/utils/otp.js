const twilio = require('twilio');

const sendSMS = async (options) => {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    try {
        const message = await client.messages.create({
            body: options.message, // The SMS body
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
            to: options.phoneNumber // Recipient's phone number
        });

        console.log(`SMS sent successfully! Message SID: ${message.sid}`);
    } catch (error) {
        console.error(`Error sending SMS: ${error.message}`);
        throw error; // Optionally handle the error further
    }
};

module.exports = sendSMS;
