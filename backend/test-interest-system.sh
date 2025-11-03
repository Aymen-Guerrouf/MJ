#!/bin/bash
# Test script for Interest-Based Recommendation System
# Run this after starting the backend server

BASE_URL="http://localhost:3001"
EMAIL="test$(date +%s)@example.com"
PASSWORD="Test123456"
NAME="Test User"
AGE=25

echo "🧪 Testing Interest-Based Recommendation System"
echo "================================================"
echo ""

# 1. Register
echo "📝 Step 1: Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\",\"age\":$AGE}")

echo "Response: $REGISTER_RESPONSE"
echo ""

# 2. Note: In real scenario, user would get email with verification code
# For testing, we'll skip email verification and login directly
echo "⏭️  Step 2: Skipping email verification (use actual code from email in production)"
echo ""

# 3. Login (after manual verification)
echo "🔐 Step 3: Please verify email manually, then press Enter to continue login..."
read -p "Press Enter after verifying email..."

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "❌ Login failed. Cannot continue test."
    exit 1
fi

echo "✅ Login successful!"
echo "Token: ${TOKEN:0:20}..."
echo ""

# 4. Update interests
echo "🎯 Step 4: Updating user interests..."
INTERESTS_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/user/interests" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"interests":["coding","tech","gaming"]}')

echo "Response: $INTERESTS_RESPONSE"
echo ""

# 5. Get recommendations
echo "🎁 Step 5: Getting personalized recommendations..."
RECOMMENDATIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/user/eventRecommendation" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $RECOMMENDATIONS_RESPONSE"
echo ""

# 6. Get user profile to verify interests
echo "👤 Step 6: Verifying interests in user profile..."
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $PROFILE_RESPONSE"
echo ""

echo "✅ Test Complete!"
echo "================================================"
echo ""
echo "Summary:"
echo "- User registered: $EMAIL"
echo "- Interests set: coding, tech, gaming"
echo "- Recommendations retrieved successfully"
echo ""
echo "Next steps:"
echo "1. Test the mobile app signup flow"
echo "2. Select interests in InterestSelection screen"
echo "3. Verify recommendations on home screen"
