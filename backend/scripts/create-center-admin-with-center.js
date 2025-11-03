import mongoose from 'mongoose';
import User from '../src/models/user.model.js';
import Center from '../src/models/center.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mj-hackathon';

async function createCenterAdminWithCenter() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if center admin already exists
    const existingAdmin = await User.findOne({ email: 'centeradmin@mj.dz' });

    if (existingAdmin && existingAdmin.managedCenterId) {
      console.log(
        '✅ Center admin already exists with managedCenterId:',
        existingAdmin.managedCenterId
      );
      const center = await Center.findById(existingAdmin.managedCenterId);
      if (center) {
        console.log('✅ Center found:', center.name);
        console.log('\nCenter Admin Details:');
        console.log('Email:', existingAdmin.email);
        console.log('Name:', existingAdmin.name);
        console.log('Role:', existingAdmin.role);
        console.log('Managed Center ID:', existingAdmin.managedCenterId);
        console.log('Center Name:', center.name);
        console.log('Center Wilaya:', center.wilaya);
        await mongoose.connection.close();
        return;
      }
    }

    // Find or create a center
    let center = await Center.findOne();

    if (!center) {
      console.log('📝 No centers found. Creating a new center...');
      center = await Center.create({
        name: 'MJ Center - Algiers',
        wilaya: 'Algiers',
        address: '123 Main Street, Algiers',
        phone: '+213 555 123 456',
        email: 'contact@mj-algiers.dz',
        hasTour: true,
        latitude: 36.7538,
        longitude: 3.0588,
        images: [],
        adminIds: [],
      });
      console.log('✅ Center created:', center.name);
    } else {
      console.log('✅ Using existing center:', center.name);
    }

    // Create or update center admin
    if (existingAdmin) {
      console.log('📝 Updating existing center admin with managedCenterId...');
      existingAdmin.managedCenterId = center._id;
      await existingAdmin.save();
      console.log('✅ Center admin updated successfully');

      // Add admin to center's adminIds if not already there
      if (!center.adminIds.includes(existingAdmin._id)) {
        center.adminIds.push(existingAdmin._id);
        await center.save();
        console.log("✅ Admin added to center's adminIds");
      }
    } else {
      console.log('📝 Creating new center admin...');
      const centerAdmin = await User.create({
        email: 'centeradmin@mj.dz',
        password: 'Admin@123456',
        name: 'Center Administrator',
        role: 'center_admin',
        managedCenterId: center._id,
        isEmailVerified: true,
        interests: ['education', 'culture'],
      });
      console.log('✅ Center admin created successfully');

      // Add admin to center's adminIds
      center.adminIds.push(centerAdmin._id);
      await center.save();
      console.log("✅ Admin added to center's adminIds");
    }

    // Fetch the final admin data
    const admin = await User.findOne({ email: 'centeradmin@mj.dz' });
    const finalCenter = await Center.findById(admin.managedCenterId);

    console.log('\n=== CENTER ADMIN CREATED SUCCESSFULLY ===');
    console.log('\nLogin Credentials:');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123456');
    console.log('\nAdmin Details:');
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Email Verified:', admin.isEmailVerified);
    console.log('Managed Center ID:', admin.managedCenterId);
    console.log('\nManaged Center:');
    console.log('Center ID:', finalCenter._id);
    console.log('Center Name:', finalCenter.name);
    console.log('Wilaya:', finalCenter.wilaya);
    console.log('Address:', finalCenter.address);
    console.log('Phone:', finalCenter.phone);
    console.log('Email:', finalCenter.email);
    console.log('\n✅ All done! You can now login with the center admin credentials.');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createCenterAdminWithCenter();
