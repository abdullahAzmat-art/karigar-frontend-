const Service = require('../models/Service');
const Booking = require('../models/Booking');

// @desc    Create or update service profile
// @route   POST /api/provider/service
// @access  Private/Provider
exports.upsertServiceProfile = async (req, res) => {
    try {
        const { title, description, category, price, availability } = req.body;

        // Validation
        if (!title || !description || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: title, description, category, and price'
            });
        }

        let service = await Service.findOne({ provider: req.user.id });

        if (service) {
            // Update
            service = await Service.findOneAndUpdate(
                { provider: req.user.id },
                { title, description, category, price, availability },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ success: true, data: service });
        }

        // Create
        service = await Service.create({
            provider: req.user.id,
            title,
            description,
            category,
            price,
            availability
        });

        res.status(201).json({ success: true, data: service });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get provider service profile
// @route   GET /api/provider/service
// @access  Private/Provider
exports.getServiceProfile = async (req, res) => {
    try {
        const service = await Service.findOne({ provider: req.user.id });

        if (!service) {
            return res.status(404).json({ success: false, message: 'Service profile not found' });
        }

        res.status(200).json({ success: true, data: service });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all bookings for provider
// @route   GET /api/provider/bookings
// @access  Private/Provider
exports.getProviderBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ provider: req.user.id })
            .populate('customer', 'name email phone')
            .populate('service', 'title');

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update booking status (Accept, Reject, Complete)
// @route   PUT /api/provider/bookings/:id
// @access  Private/Provider
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['requested', 'confirmed', 'completed', 'cancelled', 'rejected'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Make sure booking belongs to provider
        if (booking.provider.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this booking' });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Reschedule booking
// @route   PUT /api/provider/bookings/:id/reschedule
// @access  Private/Provider
exports.rescheduleBooking = async (req, res) => {
    try {
        const { bookingDate } = req.body;

        if (!bookingDate) {
            return res.status(400).json({ success: false, message: 'Please provide a new booking date' });
        }

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.provider.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to reschedule this booking' });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, { bookingDate, status: 'confirmed' }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
