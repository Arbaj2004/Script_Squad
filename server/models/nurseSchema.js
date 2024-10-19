const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const nurseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
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
    isAvailable: {
        type: Boolean,
        default: true, // Track if the nurse is available for new assignments
    },
    shift: {
        startTime: {
            type: String, // e.g., '09:00'
            // required: true,
        },
        endTime: {
            type: String, // e.g., '18:00'
            // required: true,
        },
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        // // required: [true, 'Gender is required'],
    },
    vehicle: {
        type: String,
        enum: ['Car', 'Bike', 'Cycle', 'On Foot'], // Optional: Vehicle for travel
        // required: true,
    },
    assignedPatients: [
        {
            patientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient', // Reference to Patient model
            },
            assignedAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    qualification: {
        degree: {
            type: String,
            // // required: [true, 'Qualification degree is required'],
        },
        institution: {
            type: String,
            // // required: [true, 'Institution name is required'],
        },
        yearOfPassing: {
            type: Number,
            // // required: [true, 'Year of passing is required'],
        },
    },
    proofOfQualification: {
        type: String, // URL or path to the uploaded document
        // // required: [true, 'Proof of qualification is required'],
    }
}, { timestamps: true });


const Nurse = mongoose.model('Nurse', nurseSchema);

module.exports = Nurse;
