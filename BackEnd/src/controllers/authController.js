const User = require('../models/User');

// Register new user
const register = async (req, res) => {
  console.log('📥 Register request received:', req.body); // ADD THIS

  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save(); // Password gets hashed automatically here

    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user._id 
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register };