const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', register);


router.post('/login', login);

router.get('/verify', authMiddleware, (req, res) => {
    res.json({ valid: true, userId: req.userId });
});

router.post('/logout', logout);

module.exports = router;