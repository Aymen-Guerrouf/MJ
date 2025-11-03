#!/usr/bin/env node

/**
 * Script to create a Super Admin user
 * Usage: node create-super-admin.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Import User model
import User from '../src/models/user.model.js';

const SUPER_ADMIN_DATA = {
  name: 'Super Admin',
  email: 'admin@mj.dz',
  password: 'Admin@123456', // Change this after first login!
  role: 'super_admin',
  age: 30, // Age is required
  interests: ['tech', 'education', 'coding'], // Must use valid enum values
  isEmailVerified: true,
};

async function createSuperAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mj-hackathon');
    console.log('✅ Connected to MongoDB\n');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: SUPER_ADMIN_DATA.email });

    if (existingAdmin) {
      console.log('⚠️  Super admin already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('\n💡 If you forgot the password, you can reset it via the API');
      process.exit(0);
    }

    // Create super admin (password will be hashed by the model's pre-save hook)
    console.log('👤 Creating super admin...');
    const superAdmin = await User.create(SUPER_ADMIN_DATA);

    console.log('\n✅ Super Admin created successfully!\n');
    console.log('═══════════════════════════════════════════');
    console.log('📋 Super Admin Credentials');
    console.log('═══════════════════════════════════════════');
    console.log('📧 Email:', SUPER_ADMIN_DATA.email);
    console.log('🔑 Password:', SUPER_ADMIN_DATA.password);
    console.log('👤 Name:', SUPER_ADMIN_DATA.name);
    console.log('🎭 Role:', SUPER_ADMIN_DATA.role);
    console.log('🆔 User ID:', superAdmin._id);
    console.log('═══════════════════════════════════════════\n');

    console.log('⚠️  SECURITY WARNING:');
    console.log('   Please change this password after first login!\n');

    console.log('🚀 Quick Start:');
    console.log('   1. Login at: POST /api/auth/login');
    console.log('   2. Use credentials above');
    console.log('   3. Change password: PUT /api/auth/password\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
}

// Run the script
createSuperAdmin();
