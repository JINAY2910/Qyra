import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Load environment variables from /server/.env
dotenv.config({ path: './.env' });

const createAdmin = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error('❌ Error: MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    // Connect to database
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@qyra.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@qyra.com',
      password: 'admin123',
      role: 'admin',
      avgTimePerCustomer: 10, // Default 10 minutes
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@qyra.com');
    console.log('Password: admin123');
    console.log('ID:', admin._id);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();

