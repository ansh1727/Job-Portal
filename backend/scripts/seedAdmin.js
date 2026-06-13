require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jobportal.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully');
    console.log(`Email: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
