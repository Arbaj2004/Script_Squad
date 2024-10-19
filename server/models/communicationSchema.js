// models/CommunicationSchema.js
const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse' },
});

const Communication = mongoose.model('Communication', communicationSchema);
module.exports = Communication;
