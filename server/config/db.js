import mongoose from 'mongoose';

const connectDB = () => {
  const uri = process.env.MONGO_URI;
  
  if (!uri) {
    console.error('❌ Error: MONGO_URI is not defined in .env file');
    process.exit(1);
  }

  mongoose.connect(uri)
    .then(() => {
      console.log('✅ MongoDB Connected Successfully');
      console.log(`   Database: ${mongoose.connection.name}`);
      console.log(`   Host: ${mongoose.connection.host}`);
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      process.exit(1);
    });

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
};

export default connectDB;

