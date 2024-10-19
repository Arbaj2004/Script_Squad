const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/getAllUnverfiedNurses', adminController.getUnverifiedNurses);
router.get('/verifyNurse/:nurseId', adminController.verifyNurse);


module.exports = router;