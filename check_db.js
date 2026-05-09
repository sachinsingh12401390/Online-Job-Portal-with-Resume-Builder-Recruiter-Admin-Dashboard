const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const jobCount = await Job.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`Jobs: ${jobCount}`);
    console.log(`Users: ${userCount}`);
    
    if (jobCount > 0) {
      const jobs = await Job.find().limit(5).populate('recruiter', 'name');
      console.log('Sample Jobs:');
      jobs.forEach(j => console.log(`- ${j.title} at ${j.company} (by ${j.recruiter?.name})`));
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkData();
