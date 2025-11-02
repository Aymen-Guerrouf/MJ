#!/usr/bin/env node

/**
 * Cloudinary Upload Test Script
 * Tests direct upload to Cloudinary using unsigned preset
 */

import { createReadStream, existsSync } from 'fs';
import { basename } from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

// CONFIGURATION - UPDATE THESE
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME'; // e.g., 'demo'
const CLOUDINARY_UPLOAD_PRESET = 'YOUR_UNSIGNED_PRESET'; // Create in Cloudinary dashboard
const TEST_FILE_PATH = './test-image.jpg'; // Path to test file

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║          Cloudinary Upload Test                        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Validation
if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME') {
  console.error('❌ Error: Please update CLOUDINARY_CLOUD_NAME in the script');
  console.log('\n📝 How to get your Cloud Name:');
  console.log('1. Go to https://cloudinary.com/console');
  console.log('2. Copy your Cloud Name from the dashboard\n');
  process.exit(1);
}

if (CLOUDINARY_UPLOAD_PRESET === 'YOUR_UNSIGNED_PRESET') {
  console.error('❌ Error: Please update CLOUDINARY_UPLOAD_PRESET in the script');
  console.log('\n📝 How to create an unsigned upload preset:');
  console.log('1. Go to https://cloudinary.com/console/settings/upload');
  console.log('2. Scroll to "Upload presets"');
  console.log('3. Click "Add upload preset"');
  console.log('4. Set Signing Mode to "Unsigned"');
  console.log('5. Give it a name (e.g., "msj_test")');
  console.log('6. Save and use that name here\n');
  process.exit(1);
}

async function testCloudinaryUpload() {
  try {
    console.log('🔍 Checking test file...');

    // Check if test file exists
    if (!existsSync(TEST_FILE_PATH)) {
      console.error(`❌ Test file not found: ${TEST_FILE_PATH}`);
      console.log('\n💡 Options:');
      console.log('1. Create a test file: touch test-image.jpg');
      console.log('2. Or update TEST_FILE_PATH in the script to point to an existing image\n');
      return;
    }

    console.log(`✅ Found test file: ${TEST_FILE_PATH}`);
    console.log(`\n📤 Uploading to Cloudinary...`);
    console.log(`   Cloud: ${CLOUDINARY_CLOUD_NAME}`);
    console.log(`   Preset: ${CLOUDINARY_UPLOAD_PRESET}\n`);

    // Create form data
    const formData = new FormData();
    formData.append('file', createReadStream(TEST_FILE_PATH));
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Upload failed!');
      console.error('Error:', data.error?.message || JSON.stringify(data, null, 2));

      if (data.error?.message?.includes('Invalid upload preset')) {
        console.log('\n💡 The upload preset name is incorrect or not configured as "unsigned"');
        console.log('   Check your Cloudinary dashboard: Settings → Upload → Upload presets');
      }
      return;
    }

    console.log('✅ Upload successful!\n');
    console.log('📋 Response Details:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Public ID:    ${data.public_id}`);
    console.log(`URL:          ${data.url}`);
    console.log(`Secure URL:   ${data.secure_url}`);
    console.log(`Format:       ${data.format}`);
    console.log(`Size:         ${(data.bytes / 1024).toFixed(2)} KB`);
    console.log(`Width:        ${data.width}px`);
    console.log(`Height:       ${data.height}px`);
    console.log(`Created:      ${data.created_at}`);
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('🎯 Use this URL in your API:');
    console.log(`   ${data.secure_url}\n`);

    console.log('✅ Cloudinary is working correctly!');
    console.log('\n💡 Next steps:');
    console.log('1. Update your frontend to use this Cloud Name and Upload Preset');
    console.log('2. Frontend uploads files directly to Cloudinary');
    console.log('3. Frontend sends the secure_url to your backend API');
    console.log('4. Your backend saves the URL in MongoDB\n');
  } catch (error) {
    console.error('❌ Error:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Network error. Check your internet connection.');
    } else if (error.message.includes('form-data')) {
      console.log('\n💡 Install missing dependency: npm install form-data node-fetch');
    }
  }
}

// Run the test
testCloudinaryUpload();
