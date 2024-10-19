const mongoose = require('mongoose');
const validator = require('validator');

const contactusSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    subject: {
        type: String,
        required: [true, 'Please tell us your mis!']
    },
    message: {
        type: String,
        required: [true, 'Please tell us your mis!']
    }
},
    {
        timestamps: true     //this will note the timestamp of user created or updated 
    });
const ContactUs = mongoose.model('ContactUs', contactusSchema);

module.exports = ContactUs;