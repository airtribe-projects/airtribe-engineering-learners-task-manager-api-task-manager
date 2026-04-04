const express = require('express');
const router = express.Router();
const controller = require('../controllers/parkingController');

router.post('/checkin', controller.checkIn);
router.post('/checkout', controller.checkOut);
router.get('/availability', controller.getAvailability);

module.exports = router;