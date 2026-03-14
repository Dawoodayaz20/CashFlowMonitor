const { Resend } = require('resend');
const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');

const resend = new Resend(process.env.RESEND_API_KEY);

router.use(authMiddleware);

router.get('/',  getSettings);
router.put('/',  updateSettings);

module.exports = router;