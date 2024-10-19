//email mis to be change from env while sending mail

const jwt = require('jsonwebtoken');
const User = require('../models/userSchema')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const nodemailer = require('nodemailer')
const sendEmail = require('./../utils/email');
const crypto = require('crypto');
const { decode } = require('punycode');
const Nurse = require('../models/nurseSchema');
const Patient = require('../models/patientSchema');
const sendSMS = require('../utils/otp');
const _ = require('lodash');

function deepMerge(obj1, obj2) {
    return {
        ...obj1,
        ...obj2,
        person: { ...obj1.person, ...obj2.person }
    };
}


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


const createSendToken = (user, userr, statusCode, req, res) => {
    const tokenData = {
        id: user._id,
        role: userr.role,
        phone: userr.phone
    }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    user.password = undefined;
    // console.log("userrr", userr);
    // console.log(">>>><<<<", user);
    res.status(statusCode).cookie('token', token, { maxAge: 9000000, httpOnly: true, secure: true, }).json({
        status: 'success',
        token,
        data: {
            userr,
            user
        }
    });
};


exports.signup = catchAsync(async (req, res, next) => {
    var { name, phone, password, passwordConfirm, role } = req.body;
    if (role == "Admin") {
        role = "Patient"
    }
    // console.log(req.body);
    if (!name || !phone || !password || !passwordConfirm || !role) {
        return next(new AppError('Enter all fields'))
    }

    // Validate password and passwordConfirm
    if (password !== passwordConfirm) {
        return next(new AppError('Passwords do not match!', 400));
    }
    const user = await User.findOne({ phone: phone }); // Use await to resolve the promise

    if (user) { // Check if user exists
        // console.log(user.phone);
        return next(new AppError('Duplicate Phone Found.', 401));
    }

    // If no user found, continue with your next logic


    // Generate a 6-digit integer OTP
    const Emailotp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP

    // Hash the OTP
    const hashedOtp = crypto
        .createHash('sha256')
        .update(Emailotp)
        .digest('hex');

    const EmailotpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    const randomString = generateRandomString(6);
    const modifiedPhone = "notverified" + randomString + phone;
    const modifiedPhone1 = "+91" + phone;
    // Create new user with hashed OTP and its expiration
    const newUser = await User.create({
        name,
        phone: modifiedPhone,
        password,
        passwordConfirm,
        role,
        Emailotp: hashedOtp,
        EmailotpExpires
    });
    // console.log(newUser);

    // Send the original OTP via phone
    const message = `Your OTP code is ${Emailotp}  . It will expire in 10 minutes.`;
    console.log(message);
    try {
        // await sendSMS({
        //     phoneNumber: modifiedPhone1, // User's phone number
        //     message, // OTP message
        // });
    } catch (err) {
        // Clean up user data if email sending fails
        newUser.Emailotp = undefined;
        newUser.EmailotpExpires = undefined;
        await newUser.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
    createSendToken(newUser, newUser, 200, req, res);
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    // console.log(process.env.JWT_SECRET_KEY);
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user still exists
    // console.log("😍😒😂🔥🤣", req.body.Emailotp);
    console.log(decoded);
    const hashedOtp = crypto
        .createHash('sha256')
        .update(req.body.Emailotp)
        .digest('hex');
    // console.log(decoded);
    const realEmail = decoded.phone;
    const realEmail1 = realEmail.slice(17); // Adjust based on your slicing logic
    const user = await User.findOne({ phone: realEmail1 }); // Use await to resolve the promise

    // console.log(decoded.phone);
    if (user) { // Check if user exists
        // console.log(user.phone);
        return next(new AppError('Duplicate Phone Found.', 401));
    }

    // If no user found, continue with your next logic
    // console.log(decoded);

    const oldUser = await User.findOne({
        $and: [
            { phone: decoded.phone }, // Match the email
            { Emailotp: hashedOtp }, // Match the hashed OTP
            { EmailotpExpires: { $gt: Date.now() } } // Ensure OTP has not expired
        ]
    });

    if (!oldUser) {
        return next(
            new AppError(
                'Invalid User Please do not verify otp',
                401
            )
        );
    }
    await User.findByIdAndUpdate(
        oldUser._id,            // Find the user by their ID
        { phone: realEmail1 }   // Update the email field with `realEmail1`
    );
    oldUser.phone = realEmail1;
    // console.log(oldUser);
    var userr = oldUser;
    if (oldUser.role === 'Nurse') {
        userr = await Nurse.create({
            user: oldUser._id
        });
    } else if (oldUser.role === 'Patient') {
        userr = await Patient.create({
            user: oldUser._id,
        });
    }
    createSendToken(userr, oldUser, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { phone, password } = req.body;
    // 1) Check if email and password exist
    if (!phone) {
        return next(new AppError('Please provide email!', 400));
    }
    if (!phone || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists && password is correct
    var user;
    if (phone) {
        user = await User.findOne({ phone: phone }).select('+password');
    }
    var userr = user;
    if (user.role === 'Nurse') {
        userr = await Nurse.findOne({ user: user._id })
    }
    if (user.role === 'Patient') {
        userr = await Patient.findOne({ user: user._id })
    }
    // console.log(userr);
    if (!userr || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    // 3) If everything ok, send token to client
    createSendToken(userr, user, 200, req, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        maxAge: 9000,
        httpOnly: true
    });
    res.status(200).clearCookie('token').json({ status: 'success' });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    var user;
    if (req.body.phone) {
        user = await User.findOne({ phone: req.body.phone });
    }
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    console.log("Before saving:", user);
    await user.save({ validateBeforeSave: false });
    console.log("After saving:", user);

    // await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    // console.log(resetURL);
    try {
        // await sendEmail({
        //     email: user.email,
        //     subject: 'Your password reset token (valid for 10 min)',
        //     html: passwordResetEmail(user, resetURL)
        // });
        console.log("😒😒😒😒", resetToken);
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        // console.log(err);
        return next(
            new AppError('There was an error sending the email. Try again later!'),
            500
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });


    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    var userr = user;
    if (user.role === 'Nurse') {
        userr = await Nurse.findOne({ user: user._id })
    }
    if (user.role === 'Patient') {
        userr = await Patient.findOne({ user: user._id })
    }

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(userr, user, 200, req, res);
});

exports.restrictTo = (...roles) => {
    return async (req, res, next) => {
        if (req.cookies.jwt) {
            return next(
                new AppError('You logged out', 401)
            );
        }
        // 1) Getting token and check of it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        console.log(token)
        if (!token || token == 'null') {
            return next(
                new AppError('You are not logged in! Please log in to get access.', 401)
            );
        }

        console.log(">>>><<<<");
        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

        // 3) Check if user still exists
        // console.log(decoded);
        const currentUser = await User.findOne({ phone: decoded.phone });
        if (!currentUser) {
            return next(
                new AppError(
                    'The user belonging to this token does no longer exist.',
                    401
                )
            );
        }
        if (!roles.includes(currentUser.role)) {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }

        next();
    };
};
