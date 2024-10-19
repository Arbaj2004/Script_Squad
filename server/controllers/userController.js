const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ContactUs = require('../models/contactUsSchema');
const Patient = require('../models/patientSchema');
const Nurse = require('../models/nurseSchema');

// Get all blogs
exports.sendContactUsMessage = catchAsync(async (req, res, next) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
        return next(
            new AppError('provide all required fields', 401)
        );
    }
    const newMessage = await ContactUs.create(req.body);
    res.status(200).json({
        status: 'success',
        results: newMessage.length,
        data: {
            newMessage
        }
    });
});

exports.getUserCordinates = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const newMessage = await Patient.find({ user: id });
    const loc = newMessage[0].location
    res.status(200).json({
        status: 'success',
        data: {
            loc
        }
    });
})

exports.getUserCordinatesN = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const newMessage = await Nurse.find({ user: id });
    const loc = newMessage[0].location
    res.status(200).json({
        status: 'success',
        data: {
            loc
        }
    });
})