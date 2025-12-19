const Service = require('../models/Service');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get all services
// @route   GET /api/customer/services
// @access  Private (Customer)
exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().populate({
            path: 'provider',
            select: 'name email phone address'
        });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single provider profile and their services
// @route   GET /api/customer/provider/:id
// @access  Private (Customer)
exports.getProviderProfile = async (req, res) => {
    try {
        const provider = await User.findById(req.params.id);

        if (!provider || provider.role !== 'provider') {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }

        const services = await Service.find({ provider: req.params.id });

        res.status(200).json({
            success: true,
            data: {
                provider,
                services
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create booking request
// @route   POST /api/customer/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
    try {
        const { serviceId, bookingDate } = req.body;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }

        const booking = await Booking.create({
            customer: req.user.id,
            service: serviceId,
            provider: service.provider,
            bookingDate,
            amount: service.price
        });

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get customer booking history
// @route   GET /api/customer/bookings
// @access  Private (Customer)
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id })
            .populate({
                path: 'service',
                select: 'name price'
            })
            .populate({
                path: 'provider',
                select: 'name email phone'
            });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Cancel booking
// @route   PATCH /api/customer/bookings/:id/cancel
// @access  Private (Customer)
exports.cancelBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Make sure booking belongs to customer
        if (booking.customer.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to cancel this booking' });
        }

        // Only allow cancellation if status is 'requested'
        if (booking.status !== 'requested') {
            return res.status(400).json({ success: false, message: 'Cannot cancel booking after it has been confirmed or completed' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
