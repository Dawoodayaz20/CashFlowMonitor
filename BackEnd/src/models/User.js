const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }},
  {
  timestamps: true  // Adds createdAt and updatedAt automatically
});

userSchema.pre('save', async function(){
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
    ;     // Note: The next function tells mongoose to move to the next step
});

module.exports = mongoose.model('User', userSchema);