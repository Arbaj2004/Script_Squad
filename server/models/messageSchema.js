// models/messageSchema.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse' },
    content: String,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
