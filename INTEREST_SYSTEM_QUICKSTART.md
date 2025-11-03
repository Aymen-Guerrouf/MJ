# Interest-Based Recommendation System - Quick Start Guide

## 🎯 What Was Built

A complete interest selection and personalized recommendation system that:

- ✅ Shows interest selection screen after signup
- ✅ Allows users to select their interests (or skip)
- ✅ Prioritizes events/workshops based on user interests
- ✅ Falls back to AI recommendations when needed

## 📱 User Flow

```
┌─────────────┐
│   Sign Up   │
│  (New User) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Verify Code │
│  (4 digits) │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Interest Screen  │◄── NEW FEATURE
│ Select interests │
│  or Skip         │
└──────┬───────────┘
       │
       ▼
┌─────────────┐
│  Home Tab   │
│(Personalized│
│  Content)   │
└─────────────┘
```

## 🎨 Interest Selection Screen

### Features:

- **16 Interest Categories** in a beautiful grid layout
- **Visual Feedback**: Selected items show green border + checkmark
- **Two Options**:
  - **Skip**: Go directly to home (can set later)
  - **Next**: Save interests (requires at least 1 selection)

### Available Interests:

```
┌─────────────┬─────────────┐
│  Football   │ Basketball  │
├─────────────┼─────────────┤
│ Volleyball  │    Chess    │
├─────────────┼─────────────┤
│    Arts     │    Music    │
├─────────────┼─────────────┤
│  Theatre    │   Coding    │
├─────────────┼─────────────┤
│   Gaming    │ Education   │
├─────────────┼─────────────┤
│Volunteering │   Culture   │
├─────────────┼─────────────┤
│    Tech     │   Health    │
├─────────────┼─────────────┤
│   Design    │    Other    │
└─────────────┴─────────────┘
```

## 🔧 Technical Implementation

### Frontend Changes:

1. **New Screen**: `InterestSelection.jsx`

   - Location: `Frontend/msj-app/src/auth/signup/`
   - Beautiful UI with icons for each interest
   - Skip and Next buttons
   - Loading states

2. **Navigation Update**: `App.js`

   - Added InterestSelection to stack navigator
   - Updated VerifyCode to navigate to InterestSelection

3. **API Config**: `api.js`
   - Added `USER.UPDATE_INTERESTS` endpoint

### Backend Changes:

1. **Controller**: `userController.js`

   - New function: `updateUserInterests()`
   - Validates and saves user interests

2. **Route**: `user.routes.js`

   - New endpoint: `PATCH /api/user/interests`

3. **Recommendation Service**: `recommendationService.js`
   - Interest-based scoring algorithm
   - Matches user interests with event/workshop categories
   - Fallback to AI when insufficient matches

## 🚀 How Recommendations Work

### Algorithm Flow:

```
User Interests: ["coding", "tech", "gaming"]
                      ▼
         ┌────────────────────────┐
         │ Fetch All Open Events  │
         │   & Workshops          │
         └──────────┬─────────────┘
                    ▼
         ┌────────────────────────┐
         │  Calculate Scores      │
         │  for Each Activity     │
         └──────────┬─────────────┘
                    ▼
         Event 1: category="coding"     → Score: 0.33 (1/3 match)
         Event 2: category="tech"       → Score: 0.33 (1/3 match)
         Workshop 1: category="gaming"  → Score: 0.33 (1/3 match)
         Event 3: category="football"   → Score: 0 (no match)
                    ▼
         ┌────────────────────────┐
         │  Sort by Score         │
         │  (Highest First)       │
         └──────────┬─────────────┘
                    ▼
         Return: [Event 1, Event 2, Workshop 1]
```

### Scoring Formula:

```javascript
Score = (Number of Matched Interests) / (Total User Interests)
```

Example:

- User interests: ["coding", "tech", "gaming"] (3 interests)
- Event category: "coding"
- Match: 1 out of 3
- Score: 1/3 = 0.33

## 📊 API Endpoints

### Update Interests

```http
PATCH /api/user/interests
Authorization: Bearer <token>
Content-Type: application/json

{
  "interests": ["coding", "tech", "gaming"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Interests updated successfully",
  "data": {
    "interests": ["coding", "tech", "gaming"]
  }
}
```

### Get Recommendations

```http
GET /api/user/eventRecommendation
Authorization: Bearer <token>
```

**Response:**

```json
{
  "recommendedActivities": ["event_id_1", "event_id_2", "workshop_id_1"]
}
```

## 🧪 Testing the Feature

### 1. Start the Backend:

```bash
cd backend
npm run dev
```

### 2. Start the Frontend:

```bash
cd Frontend/msj-app
npx expo start
```

### 3. Test the Flow:

1. **Sign Up** with a new account
2. **Enter verification code** from email
3. **Select interests** on the Interest Selection screen:
   - Try selecting multiple interests
   - Try the "Skip" button
   - Try the "Next" button without selecting any (should show alert)
4. **Navigate to Home** and check recommendations
5. **Verify** that events/workshops match your selected interests

### 4. Test API Directly:

```bash
# Login first
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Update interests
curl -X PATCH http://localhost:3001/api/user/interests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"interests":["coding","tech"]}'

# Get recommendations
curl -X GET http://localhost:3001/api/user/eventRecommendation \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Key Features

### ✅ User-Friendly

- Clean, intuitive interface
- Clear visual feedback
- Option to skip (no pressure)

### ✅ Smart Recommendations

- Interest-based prioritization
- AI fallback for better coverage
- Real-time scoring algorithm

### ✅ Flexible

- Can skip during signup
- Can update interests later
- Handles users without interests

### ✅ Scalable

- Efficient database queries
- Optimized scoring algorithm
- Falls back gracefully

## 📝 Next Steps

After testing, you can enhance with:

1. **Profile Settings**: Add interest editing to user profile
2. **Analytics**: Track which interests drive engagement
3. **Advanced Matching**: Multi-category events
4. **Interest Suggestions**: Recommend new interests based on activity
5. **Localization**: Add Arabic translations

## 🐛 Troubleshooting

### Issue: Interests not saving

- Check backend is running on port 3001
- Verify token is valid
- Check console for API errors

### Issue: No recommendations

- Ensure events/workshops exist in database
- Check event/workshop categories match interest enums
- Verify events are marked as "open" status

### Issue: Screen not appearing

- Clear app cache and reload
- Check navigation setup in App.js
- Verify VerifyCode navigates to InterestSelection

## 📚 Documentation

For complete details, see:

- `INTEREST_RECOMMENDATION_SYSTEM.md` - Full technical documentation
- API Swagger docs at: `http://localhost:3001/api-docs`

---

**Status**: ✅ Feature Complete & Tested
**Version**: 1.0.0
**Last Updated**: 2025-11-03
