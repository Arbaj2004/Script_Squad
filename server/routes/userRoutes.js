const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const nurseController = require('../controllers/nurseController');
const patientController = require('../controllers/patientController');
const distanceController = require('../controllers/distanceController');
const commutController = require('../controllers/commutController');
const router = express.Router();

router.post('/contactUs', userController.sendContactUsMessage);

router.post('/register', authController.signup);
router.post('/verifySignupEmailOTP', authController.verifyOtp);
router.patch('/reset-password/:token', authController.resetPassword);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.get('/logout', authController.logout);


router.patch('/updateNurse/:userId', nurseController.updateNurseByNurseId)
router.patch('/updatePatient/:userId', patientController.updatePatientByPatientId)
router.get('/getnurses', nurseController.getAllNurses)
router.get('/patients/:id/nearest-nurses', distanceController.findNearestNurses);
router.get('/getMessages/:id', nurseController.getActiveMessages);
router.post('/createCommunication', commutController.createCommunication)
router.get('/getCommunicationNurse/:id', commutController.getCommunicationNurse)
router.get('/getCommunicationPatient/:id', commutController.getCommunicationPatient)
router.get('/getCommunication/:id', commutController.getCommunication)
router.get('/getPC/:id', userController.getUserCordinates)
router.get('/getNC/:id', userController.getUserCordinatesN)

module.exports = router;