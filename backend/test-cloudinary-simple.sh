#!/bin/bash

# Simple Cloudinary Upload Test (No dependencies needed!)
# Just update the variables below and run: ./test-cloudinary-simple.sh

# ========== CONFIGURATION ==========
CLOUD_NAME="dcecdcy8v"        # Get from cloudinary.com/console
UPLOAD_PRESET="mjs_test" # Create in Settings → Upload
TEST_FILE="/home/guerrouf-aymen/Documents/MSJ/backend/r u even turing complete_.mp4"           # Path to test image
# ===================================

echo "╔════════════════════════════════════════════════════════╗"
echo "║     Cloudinary Upload Test (Shell Script)             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Validate configuration
if [ "$CLOUD_NAME" = "YOUR_CLOUD_NAME" ]; then
    echo "❌ Error: Please update CLOUD_NAME in the script"
    echo ""
    echo "📝 How to get your Cloud Name:"
    echo "1. Go to https://cloudinary.com/console"
    echo "2. Copy your Cloud Name from the dashboard"
    echo "3. Update CLOUD_NAME in this script"
    echo ""
    exit 1
fi

if [ "$UPLOAD_PRESET" = "YOUR_UNSIGNED_PRESET" ]; then
    echo "❌ Error: Please update UPLOAD_PRESET in the script"
    echo ""
    echo "📝 How to create an unsigned upload preset:"
    echo "1. Go to https://cloudinary.com/console/settings/upload"
    echo "2. Scroll to 'Upload presets'"
    echo "3. Click 'Add upload preset'"
    echo "4. Set Signing Mode to 'Unsigned'"
    echo "5. Give it a name (e.g., 'msj_test')"
    echo "6. Save and update UPLOAD_PRESET in this script"
    echo ""
    exit 1
fi

# Check if test file exists
if [ ! -f "$TEST_FILE" ]; then
    echo "❌ Test file not found: $TEST_FILE"
    echo ""
    echo "💡 Options:"
    echo "1. Create a test file (any image):"
    echo "   wget -O test-image.jpg https://picsum.photos/200"
    echo "2. Or update TEST_FILE in the script to point to an existing image"
    echo ""
    exit 1
fi

echo "✅ Configuration validated"
echo "   Cloud Name: $CLOUD_NAME"
echo "   Upload Preset: $UPLOAD_PRESET"
echo "   Test File: $TEST_FILE"
echo ""

# Upload to Cloudinary
echo "📤 Uploading to Cloudinary..."
echo ""

RESPONSE=$(curl -s -X POST \
  "https://api.cloudinary.com/v1_1/$CLOUD_NAME/video/upload" \
  -F "file=@$TEST_FILE" \
  -F "upload_preset=$UPLOAD_PRESET")

# Check for errors
if echo "$RESPONSE" | grep -q '"error"'; then
    echo "❌ Upload failed!"
    echo ""
    echo "Error details:"
    echo "$RESPONSE" | grep -o '"message":"[^"]*"' || echo "$RESPONSE"
    echo ""
    
    if echo "$RESPONSE" | grep -q "Invalid upload preset"; then
        echo "💡 The upload preset name is incorrect or not configured as 'unsigned'"
        echo "   Check: https://cloudinary.com/console/settings/upload"
    fi
    exit 1
fi

# Save response to temp file for debugging
echo "$RESPONSE" > /tmp/cloudinary-response.json

# Parse response (requires jq for pretty output)
if command -v jq &> /dev/null; then
    # Validate JSON first
    if echo "$RESPONSE" | jq empty 2>/dev/null; then
        echo "✅ Upload successful!"
        echo ""
        echo "📋 Response Details:"
        echo "═══════════════════════════════════════════════════════"
        echo "Public ID:    $(echo "$RESPONSE" | jq -r '.public_id')"
        echo "URL:          $(echo "$RESPONSE" | jq -r '.url')"
        echo "Secure URL:   $(echo "$RESPONSE" | jq -r '.secure_url')"
        echo "Format:       $(echo "$RESPONSE" | jq -r '.format')"
        echo "Resource Type:$(echo "$RESPONSE" | jq -r '.resource_type')"
        echo "Size:         $(echo "$RESPONSE" | jq -r '.bytes') bytes (~$(echo "scale=2; $(echo "$RESPONSE" | jq -r '.bytes')/1024/1024" | bc 2>/dev/null || echo '?')MB)"
        
        # For videos, show duration
        if [ "$(echo "$RESPONSE" | jq -r '.resource_type')" = "video" ]; then
            DURATION=$(echo "$RESPONSE" | jq -r '.duration // 0')
            echo "Duration:     ${DURATION}s"
        else
            echo "Width:        $(echo "$RESPONSE" | jq -r '.width')px"
            echo "Height:       $(echo "$RESPONSE" | jq -r '.height')px"
        fi
        echo "═══════════════════════════════════════════════════════"
        echo ""
        echo "🎯 Use this URL in your API:"
        SECURE_URL=$(echo "$RESPONSE" | jq -r '.secure_url')
        echo "   $SECURE_URL"
    else
        echo "⚠️  Upload might have succeeded but JSON response is malformed"
        echo ""
        echo "📋 Raw Response (first 500 chars):"
        echo "$RESPONSE" | head -c 500
        echo ""
        echo ""
        echo "💡 Full response saved to: /tmp/cloudinary-response.json"
    fi
else
    echo "✅ Upload successful!"
    echo ""
    echo "📋 Raw Response (first 500 chars):"
    echo "$RESPONSE" | head -c 500
    echo ""
    echo ""
    echo "💡 Install jq for better output: sudo apt install jq"
    echo "💡 Full response saved to: /tmp/cloudinary-response.json"
fi

echo ""
echo "✅ Cloudinary is working correctly!"
echo ""
echo "💡 Next steps:"
echo "1. Frontend uploads directly to Cloudinary (same method)"
echo "2. Frontend sends the secure_url to your backend API"
echo "3. Backend saves URL in MongoDB"
echo ""
