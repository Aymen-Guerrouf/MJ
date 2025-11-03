# Supervisor Role-Based Navigation Implementation

## Overview

Implemented supervisor-specific navigation similar to the admin panel, where supervisors sign in and are directed to a dedicated supervisor dashboard instead of the regular student interface.

## Files Created

### 1. SupervisorPanelNavigator.jsx

**Path:** `src/supervisor/SupervisorPanelNavigator.jsx`

- Stack Navigator for all supervisor-related screens
- Routes included:
  - SupervisorDashboard (main screen)
  - AllSparks
  - SupervisionRequests
  - RequestDetail
  - SparkDetail
  - MySupervisees

### 2. SupervisorDashboard.jsx

**Path:** `src/supervisor/SupervisorDashboard.jsx`

- Main landing screen for supervisors
- Features:
  - Welcome header with supervisor name
  - Logout button
  - 3 Quick Action cards:
    1. **All Sparks** - View all student projects
    2. **Supervision Requests** - Manage pending requests (with red badge count)
    3. **My Supervisees** - Track students under supervision
  - Info card explaining supervisor role
  - Green gradient design matching app theme

## Files Modified

### 1. App.js

**Changes:**

- Added import: `SupervisorPanel from "./src/supervisor/SupervisorPanelNavigator"`
- Added route: `<Stack.Screen name="SupervisorPanel" component={SupervisorPanel} />`

### 2. SignIn.jsx

**Changes:**
Added supervisor role check in authentication logic:

```javascript
const userRole = data.data.user?.role;

if (userRole === "super_admin" || userRole === "center_admin") {
  navigation.replace("AdminPanel");
} else if (userRole === "supervisor") {
  // New supervisor routing
  navigation.replace("SupervisorPanel");
} else {
  navigation.replace("HomeTab", { userCoords: coords });
}
```

## Authentication Flow

### Role-Based Navigation:

1. **super_admin / center_admin** → AdminPanel
2. **supervisor** → SupervisorPanel
3. **regular user** → HomeTab (student interface)

## Supervisor Features Available

Once logged in as supervisor, users can:

### ✅ Dashboard Access

- View personalized welcome message
- See pending request count
- Quick access to all supervisor functions
- Logout capability

### ✅ All Sparks

- Browse all student innovation projects
- View project details
- See supervision status (Available/Pending/Supervised)
- Contact students

### ✅ Supervision Requests

- View pending requests with student info
- Accept or deny requests
- Confirmation dialogs for all actions
- Real-time request count badge

### ✅ My Supervisees

- Track active supervisees
- View meeting statistics
- See project details
- Monitor supervision progress

## Backend Requirements

### User Role Field

The backend must support a `role` field in the user model with the value `"supervisor"`:

```javascript
// Example user object from backend
{
  _id: "user123",
  name: "Dr. Ahmed Hassan",
  email: "ahmed@msj.com",
  role: "supervisor", // Required for supervisor access
  // ... other fields
}
```

### API Endpoints Needed

1. **GET /supervision-requests/count**

   - Returns pending request count for badge
   - Headers: `Authorization: Bearer ${token}`

2. **GET /sparks**

   - Returns all student sparks
   - Headers: `Authorization: Bearer ${token}`

3. **GET /supervision-requests?status=pending**

   - Returns pending supervision requests
   - Headers: `Authorization: Bearer ${token}`

4. **POST /supervision-requests/:id/accept**

   - Accepts a supervision request
   - Headers: `Authorization: Bearer ${token}`

5. **POST /supervision-requests/:id/deny**

   - Denies a supervision request
   - Headers: `Authorization: Bearer ${token}`

6. **GET /my-supervisees**
   - Returns list of students under supervision
   - Headers: `Authorization: Bearer ${token}`

## Design Consistency

### Color Scheme

- **Primary Gradient:** #10b981 (green) → #059669 (dark green)
- **Cards:** White with shadow
- **Icons:** Contextual colors (orange for sparks, blue for requests, green for supervisees)
- **Badge:** Red (#ef4444) for pending count

### Layout

- Green gradient header with user greeting
- Rounded cards (borderRadius: 16)
- Consistent padding and spacing
- SafeAreaView for iOS compatibility

## Testing

### How to Test Supervisor Login:

1. **Create a supervisor user in backend:**

```javascript
// In backend go.js or similar
const supervisor = await User.create({
  name: "Supervisor Test",
  email: "supervisor@test.com",
  password: "supervisor123",
  role: "supervisor",
});
```

2. **Sign in with supervisor credentials:**

- Email: supervisor@test.com
- Password: supervisor123

3. **Expected Result:**

- Should navigate directly to SupervisorPanel
- Should see SupervisorDashboard screen
- Should NOT see bottom navigation tabs
- Should have access to all supervisor screens

## Navigation Structure

```
Sign In
  ↓
Role Check
  ↓
├─ Admin → AdminPanel (existing)
├─ Supervisor → SupervisorPanel (NEW)
│   ├─ SupervisorDashboard (landing)
│   ├─ AllSparks
│   ├─ SupervisionRequests
│   ├─ RequestDetail
│   ├─ SparkDetail
│   └─ MySupervisees
│
└─ Student → HomeTab (existing)
    ├─ Map
    ├─ Events
    ├─ Spaces
    │   └─ SparksHub
    │       ├─ YourSpark
    │       ├─ CreateSpark
    │       ├─ SupervisorsList
    │       └─ SupervisorDetail
    └─ Profile
```

## Key Differences from Admin Panel

| Feature      | Admin Panel                            | Supervisor Panel               |
| ------------ | -------------------------------------- | ------------------------------ |
| Purpose      | Manage app content (videos, resources) | Mentor students                |
| Navigation   | Single screen                          | Stack navigator with 6 screens |
| Main Actions | Upload videos                          | Review sparks, manage requests |
| Target Users | super_admin, center_admin              | supervisor                     |
| Bottom Tabs  | No                                     | No                             |

## Notes

- ✅ Supervisors have completely separate interface from students
- ✅ No access to regular HomeTab navigation
- ✅ All supervisor screens use mock data (marked with TODO for API integration)
- ✅ Logout returns to SignIn screen
- ✅ Consistent design with green gradient theme
- ⏳ Backend integration pending

## Future Enhancements

1. Real-time notifications for new requests
2. Chat/messaging with students
3. Progress tracking and reports
4. Calendar integration for meetings
5. Document sharing capability
6. Performance analytics dashboard
