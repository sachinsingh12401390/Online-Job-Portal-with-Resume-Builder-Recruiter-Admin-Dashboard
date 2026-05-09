const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Job = require('../models/Job');
const User = require('../models/User');

const seedJobs = async () => {
  try {
    const jobCount = await Job.countDocuments();
    const userCount = await User.countDocuments();

    // Ensure critical demo accounts always exist
    console.log('Verifying critical demo accounts...');

    console.log('Seeding rich mock data...');

    // Clear existing if we are doing a fresh seed to avoid duplicates for demo
    // Keep seeker@demo.com and recruiter@demo.com if they exist, or create them
    let demoSeeker = await User.findOne({ email: 'seeker@demo.com' });
    if (!demoSeeker) {
      demoSeeker = await User.create({
        name: 'Demo Seeker',
        email: 'seeker@demo.com',
        password: 'password123',
        role: 'seeker',
        isVerified: true
      });
    }

    let demoRecruiter = await User.findOne({ email: 'recruiter@demo.com' });
    if (!demoRecruiter) {
      demoRecruiter = await User.create({
        name: 'Demo Recruiter',
        email: 'recruiter@demo.com',
        password: 'password123',
        role: 'recruiter',
        isVerified: true,
        companyName: 'TechVision AI'
      });
    }

    let superAdmin = await User.findOne({ email: 'admin@careernest.ai' });
    if (!superAdmin) {
      superAdmin = await User.create({
        name: 'Super Admin',
        email: 'admin@careernest.ai',
        password: 'Admin@123',
        role: 'admin',
        isVerified: true
      });
    }

    // Create more recruiters
    const recruiters = [
      { name: 'Sarah Chen', email: 'sarah@globaltech.com', password: 'password123', role: 'recruiter', companyName: 'GlobalTech Solutions' },
      { name: 'Marcus Thorne', email: 'marcus@innovate.io', password: 'password123', role: 'recruiter', companyName: 'Innovate.io' },
      { name: 'Elena Rodriguez', email: 'elena@creativepulse.com', password: 'password123', role: 'recruiter', companyName: 'Creative Pulse' }
    ];

    const createdRecruiters = [];
    for (const r of recruiters) {
      let ur = await User.findOne({ email: r.email });
      if (!ur) ur = await User.create(r);
      createdRecruiters.push(ur);
    }
    createdRecruiters.push(demoRecruiter);

    // Create more seekers
    const seekers = [
      { name: 'Alex Rivera', email: 'alex@example.com', password: 'password123', role: 'seeker' },
      { name: 'Priya Sharma', email: 'priya@dev.com', password: 'password123', role: 'seeker' },
      { name: 'Jordan Smyth', email: 'jordan@uiux.com', password: 'password123', role: 'seeker' },
      { name: 'Taylor Swift', email: 'taylor@music.com', password: 'password123', role: 'seeker' }
    ];

    const createdSeekers = [];
    for (const s of seekers) {
      let us = await User.findOne({ email: s.email });
      if (!us) us = await User.create(s);
      createdSeekers.push(us);
    }
    createdSeekers.push(demoSeeker);

    // Create diverse jobs
    const mockJobs = [
      {
        title: 'Senior Frontend Developer',
        company: 'TechVision AI',
        location: 'San Francisco, CA (Remote)',
        description: 'Lead our frontend team building AI-driven interfaces.',
        requirements: ['React', 'TypeScript', 'Next.js'],
        salary: '$140k - $170k',
        type: 'Full-time',
        recruiter: demoRecruiter._id
      },
      {
        title: 'Backend Engineer (Node.js)',
        company: 'GlobalTech Solutions',
        location: 'New York, NY',
        description: 'Scale our microservices architecture.',
        requirements: ['Node.js', 'MongoDB', 'Redis', 'Docker'],
        salary: '$130k - $160k',
        type: 'Full-time',
        recruiter: createdRecruiters[0]._id
      },
      {
        title: 'UX Designer',
        company: 'Creative Pulse',
        location: 'Austin, TX (Hybrid)',
        description: 'Design the future of creative collaboration.',
        requirements: ['Figma', 'User Research', 'Prototyping'],
        salary: '$110k - $140k',
        type: 'Contract',
        recruiter: createdRecruiters[2]._id
      },
      {
        title: 'Product Manager',
        company: 'Innovate.io',
        location: 'Remote',
        description: 'Own the roadmap for our core SaaS product.',
        requirements: ['Agile', 'Product Strategy', 'Data Analytics'],
        salary: '$150k - $180k',
        type: 'Full-time',
        recruiter: createdRecruiters[1]._id
      },
      {
        title: 'Mobile App Developer',
        company: 'GlobalTech Solutions',
        location: 'Chicago, IL',
        description: 'Build our next-gen iOS and Android apps using React Native.',
        requirements: ['React Native', 'Swift', 'Kotlin'],
        salary: '$120k - $150k',
        type: 'Full-time',
        recruiter: createdRecruiters[0]._id
      },
      {
        title: 'DevOps Architect',
        company: 'TechVision AI',
        location: 'Remote',
        description: 'Optimize our CI/CD pipelines and cloud infrastructure.',
        requirements: ['AWS', 'Kubernetes', 'Terraform'],
        salary: '$160k - $190k',
        type: 'Full-time',
        recruiter: demoRecruiter._id
      },
      {
        title: 'Content Strategist',
        company: 'Creative Pulse',
        location: 'London, UK',
        description: 'Shape the narrative for our global brands.',
        requirements: ['SEO', 'Copywriting', 'Brand Identity'],
        salary: '£50k - £70k',
        type: 'Part-time',
        recruiter: createdRecruiters[2]._id
      },
      {
        title: 'QA Automation Engineer',
        company: 'Innovate.io',
        location: 'Toronto, ON',
        description: 'Ensure the highest quality for our enterprise software.',
        requirements: ['Selenium', 'Cypress', 'JavaScript'],
        salary: '$100k - $130k',
        type: 'Full-time',
        recruiter: createdRecruiters[1]._id
      }
    ];

    for (const jobData of mockJobs) {
      const existingJob = await Job.findOne({ title: jobData.title, company: jobData.company });
      if (!existingJob) {
        const job = await Job.create(jobData);
        
        // Add some random applicants to each job
        const numApplicants = Math.floor(Math.random() * 4); // 0 to 3 applicants
        const shuffledSeekers = [...createdSeekers].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numApplicants; i++) {
          job.applicants.push({
            user: shuffledSeekers[i]._id,
            status: ['Applied', 'Reviewed', 'Interview'][Math.floor(Math.random() * 3)],
            appliedAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) // 0-10 days ago
          });
        }
        await job.save();
      }
    }

    console.log('Rich mock data seeded successfully!');
  } catch (error) {
    console.error('Error seeding rich data:', error);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedJobs();
  } catch (error) {
    console.log(`Standard MongoDB connection failed: ${error.message}`);
    console.log(`Starting in-memory database fallback...`);

    try {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB In-Memory Server Connected: ${conn.connection.host}`);
      await seedJobs();
    } catch (fallbackError) {
      console.error(`In-Memory DB Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
