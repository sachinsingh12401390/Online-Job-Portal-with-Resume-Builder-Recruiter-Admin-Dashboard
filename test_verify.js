const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config();

const testVerification = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne().sort({ createdAt: -1 });
    if (!user) {
      console.log('No user found');
      process.exit(0);
    }

    console.log(`Found user: ${user.email} (ID: ${user._id}) Verified: ${user.isVerified}`);
    
    user.isVerified = true;
    await user.save();
    
    console.log('User verified successfully in script');
    process.exit(0);
  } catch (error) {
    console.error('Error during verification test:', error);
    process.exit(1);
  }
};

testVerification();
