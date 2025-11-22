import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Load environment variables
dotenv.config({ path: './.env' });

const createAdmin = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('❌ Error: MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@qyra.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash the password using bcrypt (salt 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user with hashed password
    // Use insertOne to bypass Mongoose pre-save hooks
    await User.collection.insertOne({
      name: 'Demo Admin',
      email: 'admin@qyra.com',
      password: hashedPassword,
      role: 'admin',
      avgTimePerCustomer: 10, // Default 10 minutes
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Demo admin created: admin@qyra.com / admin123');
    
    // Close connection and exit
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

createAdmin();

