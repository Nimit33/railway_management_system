const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/auth.middleware');
const {
  addTrain,
  getTrains,
  checkAvailability,
  bookSeat,
  getBookingDetails
} = require('../controllers/train.controller');

router.post('/', adminProtect, addTrain);

router.get('/', protect, getTrains);
router.get('/availability', protect, checkAvailability);
router.post('/book', protect, bookSeat);
router.get('/booking/:id', protect, getBookingDetails);

module.exports = router; 