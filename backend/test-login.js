import User from './src/models/user.model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', mongoose.connection.name);

    const admin = await User.findOne({ email: 'admin@msj.dz' }).select('+password');

    if (!admin) {
      console.log('❌ Admin not found in database');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ Admin found in database');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   Has password hash:', !!admin.password);
    console.log(
      '   Password hash format:',
      admin.password ? admin.password.substring(0, 7) + '...' : 'N/A'
    );

    console.log('\n🔐 Testing password: Admin@123456');
    const isValid = await admin.comparePassword('Admin@123456');
    console.log('   Result:', isValid ? '✅ VALID' : '❌ INVALID');

    if (!isValid) {
      console.log('\n🔍 Checking comparePassword method...');
      console.log('   comparePassword function exists:', typeof admin.comparePassword);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testLogin();
