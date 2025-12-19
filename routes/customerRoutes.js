const express = require('express');
const {
    getServices,
    getProviderProfile,
    createBooking,
    getBookings,
    cancelBooking
} = require('../controllers/customerController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes below this are protected and restricted to customers
router.use(protect);
router.use(authorize('customer'));

router.get('/services', getServices);
router.get('/provider/:id', getProviderProfile);
router.post('/bookings', createBooking);
router.get('/bookings', getBookings);
router.patch('/bookings/:id/cancel', cancelBooking);

module.exports = router;
