const express = require('express');
const router = express.Router();
const {
    loginAdmin,
    getAllUsers,
    updateUserStatus,
    removeUser,
    getAllServices,
    getAllReports,
    updateReportStatus,
    getPlatformMetrics,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginAdmin);

// Protected Admin routes
router.use(protect);
router.use(admin);

router.route('/users').get(getAllUsers);
router.route('/users/:id/status').put(updateUserStatus);
router.route('/users/:id').delete(removeUser);

router.route('/services').get(getAllServices);

router.route('/reports').get(getAllReports);
router.route('/reports/:id').put(updateReportStatus);

router.route('/metrics').get(getPlatformMetrics);

module.exports = router;
