const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_super_secret_key_for_karigar_admin', {
                expiresIn: '30d',
            }),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (user) {
        user.status = status;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Remove user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const removeUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private/Admin
const getAllServices = async (req, res) => {
    const services = await Service.find({}).populate('provider', 'name email');
    res.json(services);
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getAllReports = async (req, res) => {
    const reports = await Report.find({})
        .populate('reporter', 'name email')
        .populate('reportedEntity');
    res.json(reports);
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
    const { status } = req.body;
    const report = await Report.findById(req.params.id);

    if (report) {
        report.status = status;
        const updatedReport = await report.save();
        res.json(updatedReport);
    } else {
        res.status(404).json({ message: 'Report not found' });
    }
};

// @desc    Get platform metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
const getPlatformMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalBookings = await Booking.countDocuments({});
        const activeProviders = await User.countDocuments({ role: 'provider', status: 'active' });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });

        // Aggregation for monthly bookings (example of pipeline)
        const bookingsByStatus = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json({
            totalUsers,
            totalBookings,
            activeProviders,
            completedBookings,
            bookingsByStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    loginAdmin,
    getAllUsers,
    updateUserStatus,
    removeUser,
    getAllServices,
    getAllReports,
    updateReportStatus,
    getPlatformMetrics,
};
