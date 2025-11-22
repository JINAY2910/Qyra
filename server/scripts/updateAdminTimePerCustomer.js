import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Load environment variables
dotenv.config({ path: './.env' });

const updateAdminTimePerCustomer = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      console.error('❌ Error: MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all admin users without avgTimePerCustomer field or with null/undefined value
    const admins = await User.find({ 
      role: 'admin',
      $or: [
        { avgTimePerCustomer: { $exists: false } },
        { avgTimePerCustomer: null },
        { avgTimePerCustomer: undefined }
      ]
    });

    if (admins.length === 0) {
      console.log('✅ All admin users already have avgTimePerCustomer field set');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Found ${admins.length} admin user(s) without avgTimePerCustomer field`);

    // Update all admin users to have default value of 10 minutes
    const result = await User.updateMany(
      { 
        role: 'admin',
        $or: [
          { avgTimePerCustomer: { $exists: false } },
          { avgTimePerCustomer: null },
          { avgTimePerCustomer: undefined }
        ]
      },
      { 
        $set: { avgTimePerCustomer: 10 } 
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} admin user(s) with avgTimePerCustomer = 10 minutes`);
    
    // Close connection and exit
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin users:', error.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

updateAdminTimePerCustomer();

