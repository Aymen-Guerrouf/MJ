# Interest-Based Recommendation System

## Overview

Implemented a personalized interest selection and recommendation system that allows users to choose their interests during signup and receive prioritized event/workshop recommendations based on those interests.

## Features Implemented

### 1. Interest Selection Screen (Frontend)

**File:** `Frontend/msj-app/src/auth/signup/InterestSelection.jsx`

- **Visual Grid Layout**: 16 interest categories displayed in a 2-column grid
- **Available Interests**:

  - Sports: Football, Basketball, Volleyball
  - Arts & Culture: Arts, Music, Theatre, Culture
  - Technology: Coding, Gaming, Tech
  - Personal Development: Education, Health, Design
  - Community: Volunteering, Chess
  - Other: General interests

- **Features**:
  - Toggle selection with visual feedback
  - Selected interests show green border and checkmark
  - "Skip" button to bypass interest selection
  - "Next" button to save interests (requires at least 1 selection)
  - Loading states and error handling
  - Smooth navigation flow

### 2. Navigation Flow Update

**File:** `Frontend/msj-app/App.js`

**New Flow:**

```
SignUp → VerifyCode → InterestSelection → HomeTab
```

- After email verification, users are directed to the Interest Selection screen
- Users can skip if they want to set interests later
- Seamless integration with existing auth flow

### 3. Backend API Endpoint

**Controller:** `backend/src/controllers/userController.js`
**Route:** `PATCH /api/user/interests`

**Function:** `updateUserInterests(req, res)`

- Validates interests array
- Checks against valid interest enums
- Updates user document with selected interests
- Returns success response with updated interests

**Request Body:**

```json
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

### 4. Enhanced Recommendation Service

**File:** `backend/src/services/recommendationService.js`

**Algorithm:**

1. **User Interest Check**: Retrieve user's selected interests
2. **Activity Filtering**: Get open events and workshops with future dates
3. **Interest Matching**: Calculate similarity between user interests and activity categories
4. **Scoring System**:
   - Score = (Number of matched interests) / (Total user interests)
   - Higher score = Better match
5. **Prioritization**: Sort activities by score (descending)
6. **Fallback**: If insufficient interest-based matches, supplement with Recombee AI recommendations

**Key Functions:**

- `calculateInterestMatch()`: Computes similarity score
- `getRecommendations()`: Main recommendation logic with interest prioritization
- `getRecombeeRecommendations()`: Fallback AI-based recommendations

### 5. API Configuration Update

**File:** `Frontend/msj-app/src/config/api.js`

Added new endpoint:

```javascript
USER: {
  UPDATE_INTERESTS: `${API_BASE_URL}/api/user/interests`,
  ME: `${API_BASE_URL}/api/user/me`,
}
```

## User Model Integration

The user interests are stored in the existing `interests` field in the User model:

```javascript
interests: [
  {
    type: String,
    enum: [
      "football",
      "basketball",
      "volleyball",
      "chess",
      "arts",
      "music",
      "theatre",
      "coding",
      "gaming",
      "education",
      "volunteering",
      "culture",
      "tech",
      "health",
      "design",
      "other",
    ],
  },
];
```

## Event and Workshop Models

Both models have a `category` field that matches the interest enums:

- Used for matching user interests with activities
- Categories include: football, basketball, coding, tech, arts, etc.

## How It Works

### User Signup Flow:

1. User signs up with email, name, password, age
2. Verification code sent to email
3. User enters 4-digit code
4. **NEW**: User navigates to Interest Selection screen
5. User selects interests (or skips)
6. Interests saved to user profile
7. User redirected to HomeTab

### Recommendation Flow:

1. User interests retrieved from database
2. All open events/workshops fetched
3. Each activity scored based on category match with interests
4. Activities sorted by score (best matches first)
5. Top N activities returned as recommendations
6. If insufficient matches, Recombee AI fills the gap

## Benefits

1. **Personalized Experience**: Users see content relevant to their interests
2. **Better Engagement**: Targeted recommendations increase participation
3. **Flexible**: Users can skip and set preferences later
4. **Scalable**: Falls back to AI when interest data is insufficient
5. **User-Friendly**: Clean, intuitive UI for interest selection

## Testing

### To Test the Feature:

1. **Start Backend:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**

   ```bash
   cd Frontend/msj-app
   npx expo start
   ```

3. **Test Flow:**

   - Sign up with a new account
   - Verify email with code
   - Select interests on the Interest Selection screen
   - Navigate to Home and check if recommendations match interests

4. **API Testing:**

   ```bash
   # Get recommendations
   GET /api/user/eventRecommendation
   Authorization: Bearer <token>

   # Update interests
   PATCH /api/user/interests
   Authorization: Bearer <token>
   Body: { "interests": ["coding", "tech"] }
   ```

## Future Enhancements

1. **Interest Management**: Allow users to edit interests from profile settings
2. **Advanced Scoring**: Consider multiple factors (location, time, popularity)
3. **Machine Learning**: Track user engagement to refine recommendations
4. **Interest Suggestions**: Recommend new interests based on activity
5. **Analytics**: Track which interests drive most engagement
6. **Multi-Category Events**: Support events with multiple categories

## Files Modified/Created

### Frontend:

- ✅ Created: `src/auth/signup/InterestSelection.jsx`
- ✅ Modified: `App.js` (added InterestSelection to navigation)
- ✅ Modified: `src/auth/signup/VerifyCode.jsx` (navigate to InterestSelection)
- ✅ Modified: `src/config/api.js` (added USER.UPDATE_INTERESTS endpoint)

### Backend:

- ✅ Modified: `src/controllers/userController.js` (added updateUserInterests)
- ✅ Modified: `src/routes/user.routes.js` (added PATCH /interests route)
- ✅ Modified: `src/services/recommendationService.js` (interest-based scoring)

## Notes

- Interest enums are synchronized between frontend and backend
- All 16 interest categories match the User model schema
- The system gracefully handles users without interests (fallback to AI)
- Categories in events/workshops align with user interests for matching
- The recommendation algorithm is efficient and scalable
