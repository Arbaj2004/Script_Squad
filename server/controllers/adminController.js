const Nurse = require("../models/nurseSchema");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getUnverifiedNurses = catchAsync(async (req, res, next) => {
    try {
        const unverifiedNurse = await Nurse.find({ verified: false });
        res.status(200).json({
            success: true,
            count: unverifiedNurse.length,
            data: {
                unverifiedNurse
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
})

exports.verifyNurse = catchAsync(async (req, res, next) => {
    try {
        const { nurseId } = req.params;
        const unverifiedNurse = await Nurse.findOneAndUpdate(
            { _id: nurseId },
            { $set: { verified: true } }
        );


        res.status(200).json({
            success: true,
            count: unverifiedNurse.length,
            data: unverifiedNurse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
})
