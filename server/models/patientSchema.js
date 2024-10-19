const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    age: {
        type: Number,
        // // required: [true, 'Age is required'],
        min: [0, 'Age must be a positive number'],
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            //  required: [true, 'Location coordinates are required'],
        },
    },
    familyNo: {
        type: String,
        // // required: [true, 'Family contact number is required'],
        match: [/^\d{10}$/, 'Family contact must be 10 digits'],
    },
    address: {
        type: String,
        // // required: [true, 'Address is required'],
    },
    language: {
        type: String,
        // // required: [true, 'Preferred language is required'],
    },
    profilePic: {
        type: String,
        default: 'default.jpg',
    },
    medical_history: {
        allergies: {
            type: [String],
            default: [],
        },
        conditions: {
            type: [String],
            default: [],
        },
        current_medications: [
            {
                // name: { type: String, required: true },
                // dosage: { type: String, required: true },
                // frequency: { type: String, required: true },
            },
        ],
    },
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
