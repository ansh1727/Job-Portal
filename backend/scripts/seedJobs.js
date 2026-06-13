require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');

const companies = [
  {
    key: 'techcorp',
    companyName: 'TechCorp Solutions',
    website: 'https://techcorp.example.com',
    description: 'Leading software company building enterprise products for global clients.',
    industry: 'Technology',
    location: 'San Francisco, CA',
  },
  {
    key: 'datadrive',
    companyName: 'DataDrive Analytics',
    website: 'https://datadrive.example.com',
    description: 'AI and data analytics firm helping businesses make smarter decisions.',
    industry: 'Data & AI',
    location: 'New York, NY',
  },
  {
    key: 'cloudscale',
    companyName: 'CloudScale Systems',
    website: 'https://cloudscale.example.com',
    description: 'Cloud infrastructure and DevOps specialists for modern engineering teams.',
    industry: 'Cloud Computing',
    location: 'Austin, TX',
  },
];

const jobs = [
  {
    companyKey: 'techcorp',
    title: 'Senior Full Stack Developer',
    description:
      'We are looking for a Senior Full Stack Developer to join our product engineering team. You will build scalable web applications using React, Node.js, and MongoDB.\n\nResponsibilities:\n- Design and develop new features\n- Collaborate with product and design teams\n- Write clean, tested, maintainable code\n- Mentor junior developers',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    location: 'San Francisco, CA',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
    experienceRequired: { min: 4, max: 8 },
    jobType: 'full-time',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: 'techcorp',
    title: 'Frontend Engineer (React)',
    description:
      'Join our UI team to craft beautiful, accessible, and performant user interfaces. Experience with Tailwind CSS and modern React patterns is a plus.',
    salary: { min: 90000, max: 130000, currency: 'USD' },
    location: 'Remote',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux', 'Vite'],
    experienceRequired: { min: 2, max: 5 },
    jobType: 'remote',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: 'datadrive',
    title: 'Data Scientist',
    description:
      'Analyze large datasets, build predictive models, and deliver insights to stakeholders. Strong Python and ML background required.',
    salary: { min: 110000, max: 150000, currency: 'USD' },
    location: 'New York, NY',
    skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
    experienceRequired: { min: 3, max: 6 },
    jobType: 'full-time',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: 'datadrive',
    title: 'Business Analyst Intern',
    description:
      'Summer internship for students passionate about data. Work on real analytics projects with mentorship from senior analysts.',
    salary: { min: 25, max: 35, currency: 'USD' },
    location: 'New York, NY',
    skills: ['Excel', 'SQL', 'Communication', 'Analytics'],
    experienceRequired: { min: 0, max: 1 },
    jobType: 'internship',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: 'cloudscale',
    title: 'DevOps Engineer',
    description:
      'Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure on AWS. Terraform and Docker experience required.',
    salary: { min: 100000, max: 140000, currency: 'USD' },
    location: 'Austin, TX',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    experienceRequired: { min: 3, max: 7 },
    jobType: 'full-time',
    deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: 'cloudscale',
    title: 'Backend Node.js Developer',
    description:
      'Build robust REST APIs and microservices. Experience with Express, MongoDB, and JWT authentication is essential.',
    salary: { min: 95000, max: 125000, currency: 'USD' },
    location: 'Remote',
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT', 'REST APIs'],
    experienceRequired: { min: 2, max: 5 },
    jobType: 'remote',
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: 'techcorp',
    title: 'Product Designer',
    description:
      'Design intuitive user experiences for our job platform and enterprise tools. Figma proficiency and portfolio required.',
    salary: { min: 85000, max: 115000, currency: 'USD' },
    location: 'San Francisco, CA',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research'],
    experienceRequired: { min: 2, max: 4 },
    jobType: 'full-time',
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
  {
    companyKey: 'cloudscale',
    title: 'Part-time Technical Writer',
    description:
      'Create documentation for our cloud platform APIs and developer tools. Flexible hours, remote-friendly.',
    salary: { min: 40, max: 60, currency: 'USD' },
    location: 'Remote',
    skills: ['Technical Writing', 'Markdown', 'API Documentation', 'Communication'],
    experienceRequired: { min: 1, max: 3 },
    jobType: 'part-time',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let recruiter = await User.findOne({ email: 'recruiter@jobportal.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Demo Recruiter',
        email: 'recruiter@jobportal.com',
        password: 'recruiter123',
        role: 'recruiter',
      });
      console.log('Created recruiter: recruiter@jobportal.com / recruiter123');
    }

    const companyMap = {};

    for (const companyData of companies) {
      let company = await Company.findOne({ companyName: companyData.companyName });
      if (!company) {
        company = await Company.create({
          recruiter: recruiter._id,
          companyName: companyData.companyName,
          website: companyData.website,
          description: companyData.description,
          industry: companyData.industry,
          location: companyData.location,
        });
        console.log(`Created company: ${company.companyName}`);
      }
      companyMap[companyData.key] = company._id;
    }

    let created = 0;
    for (const jobData of jobs) {
      const exists = await Job.findOne({
        title: jobData.title,
        company: companyMap[jobData.companyKey],
      });

      if (exists) continue;

      await Job.create({
        title: jobData.title,
        description: jobData.description,
        salary: jobData.salary,
        location: jobData.location,
        skills: jobData.skills,
        experienceRequired: jobData.experienceRequired,
        jobType: jobData.jobType,
        deadline: jobData.deadline,
        company: companyMap[jobData.companyKey],
        postedBy: recruiter._id,
        isActive: true,
      });
      created += 1;
      console.log(`Created job: ${jobData.title}`);
    }

    const totalJobs = await Job.countDocuments({ isActive: true });
    console.log(`\nSeed complete. ${created} new jobs added. ${totalJobs} active jobs total.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedJobs();
