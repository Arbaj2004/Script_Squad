const Message = require('../models/messageSchema');
const Nurse = require('../models/nurseSchema'); // Adjust path as needed
const User = require('../models/userSchema');

exports.updateNurseByNurseId = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const nurse = await Nurse.findOneAndUpdate(
            { user: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!nurse) {
            return res.status(404).json({
                status: 'fail',
                message: 'Nurse not found with the provided user ID',
            });
        }

        res.status(200).json({
            status: 'success',
            data: { nurse },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Server error. Please try again later.',
        });
    }
};
exports.getAllNurses = async (req, res) => {
    try {
        const nurses = await Nurse.find(); // Fetch all nurses from the database

        res.status(200).json({
            status: 'success',
            results: nurses.length, // Optional: count of nurses
            data: { nurses }, // Return the nurses data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Server error. Please try again later.',
        });
    }
};

exports.getActiveMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const nurse = await Nurse.find(
            { user: id }
        )
        console.log(nurse._id);
        // Find messages for this nurse
        const messages = await Message.find({ recipient: nurse[0]._id }) // Populate sender details if needed

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}