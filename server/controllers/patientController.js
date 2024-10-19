const Patient = require("../models/patientSchema");

exports.updatePatientByPatientId = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const patient = await Patient.findOneAndUpdate(
            { user: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!patient) {
            return res.status(404).json({
                status: 'fail',
                message: 'Patient not found with the provided user ID',
            });
        }

        res.status(200).json({
            status: 'success',
            data: { patient },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Server error. Please try again later.',
        });
    }
};
