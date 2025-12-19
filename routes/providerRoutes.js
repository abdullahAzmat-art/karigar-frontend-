const express = require('express');
const {
    upsertServiceProfile,
    getServiceProfile,
    getProviderBookings,
    updateBookingStatus,
    rescheduleBooking
} = require('../controllers/providerController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and require 'provider' role
router.use(protect);
router.use(authorize('provider'));

router
    .route('/service')
    .get(getServiceProfile)
    .post(upsertServiceProfile);

router.route('/bookings').get(getProviderBookings);

router.route('/bookings/:id').put(updateBookingStatus);

router.route('/bookings/:id/reschedule').put(rescheduleBooking);

module.exports = router;
