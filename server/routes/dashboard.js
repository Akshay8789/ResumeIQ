'use strict';

const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { getStats } = require('../controllers/dashboardController');

router.get('/stats', authenticate, getStats);

module.exports = router;
