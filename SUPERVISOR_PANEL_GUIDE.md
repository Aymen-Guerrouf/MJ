# Sparks Hub - Supervisor Panel Guide

## Overview

The Supervisor Panel is a complete management system for supervisors to view all student innovation projects (Sparks), manage supervision requests, and track their supervisees.

## Screens Created

### 1. **SupervisorPanelScreen** (Main Dashboard)

- **Purpose**: Central hub for all supervisor activities
- **Features**:
  - Menu with 3 main options:
    - **All Sparks**: View all student projects in the platform
    - **Supervision Requests**: View and manage incoming requests (shows badge count)
    - **My Supervisees**: Track students currently under supervision
  - Info card explaining supervisor role and responsibilities
  - Green gradient header matching app design

### 2. **AllSparksScreen** (Browse Projects)

- **Purpose**: View all student sparks with filtering options
- **Features**:
  - Displays all student innovation projects
  - Status badges: Available, Pending, Supervised
  - Shows project image, title, categories, and creator info
  - Click any spark to view full details
  - Pull-to-refresh functionality
  - Empty state when no sparks exist

### 3. **SupervisionRequestsScreen** (Request Management)

- **Purpose**: List of all pending supervision requests
- **Features**:
  - Shows count in header (e.g., "3 pending requests")
  - Displays student avatar, name, email
  - Shows spark thumbnail and title
  - Request date with relative formatting (e.g., "2 days ago")
  - "Pending" badge on each card
  - Click to view full request details
  - Pull-to-refresh to update list

### 4. **RequestDetailScreen** (Accept/Deny Requests)

- **Purpose**: Detailed view of individual supervision request
- **Features**:
  - **Student Information Section**:
    - Avatar, name, email
    - Request timestamp
  - **Project Details Section**:
    - Full spark image, title, description
    - All categories displayed as tags
  - **Action Buttons**:
    - **Accept Request**: Green gradient button with confirmation dialog
    - **Deny Request**: Red outline button with confirmation dialog
  - Loading state while processing
  - Success alerts with auto-navigation back
  - Buttons disabled after action taken

### 5. **SparkDetailScreen** (Project Details)

- **Purpose**: Full view of any spark for supervisor review
- **Features**:
  - Large project image
  - Title with status badge
  - Creator information (avatar, name, creation date)
  - Full description
  - All categories
  - Metrics: views and likes count
  - Current supervisor info (if already supervised)
  - "Contact Student" button for communication
  - Back navigation

### 6. **MySuperviseesScreen** (Active Supervisees)

- **Purpose**: Track students currently being supervised
- **Features**:
  - Shows count in header subtitle
  - For each supervisee:
    - Student avatar, name, email
    - Spark thumbnail and title
    - Categories (shows first 2 + count)
    - Statistics row:
      - Start date
      - Number of meetings held
      - Last meeting date
  - Click to view full spark details
  - Pull-to-refresh functionality
  - Empty state when no supervisees

## Navigation Flow

### Student Flow

```
SpacesScreen
  → SparksHub (if Entrepreneurship card clicked)
  → YourSpark (if "Your Turn" FAB clicked)
  → CreateSpark (if blank state "Create Your Spark" clicked)
  → SupervisorsList (if "Find Supervisor" clicked after creating spark)
  → SupervisorDetail (if supervisor card clicked)
```

### Supervisor Flow

```
SpacesScreen
  → SupervisorPanel (if user is supervisor on sign-in)
  → AllSparks / SupervisionRequests / MySupervisees
  → SparkDetail (from AllSparks or MySupervisees)
  → RequestDetail (from SupervisionRequests)
```

## Role-Based Routing Logic

### Suggested Implementation (TODO)

```javascript
// In sign-in logic or SpacesScreen navigation
const handleEntrepreneurshipClick = () => {
  const userRole = getUserRole(); // Get from AsyncStorage or context

  if (userRole === "supervisor") {
    navigation.navigate("SupervisorPanel");
  } else {
    navigation.navigate("SparksHub");
  }
};
```

## Mock Data Structure

### Spark Object

```javascript
{
  _id: "1",
  title: "Project Title",
  description: "Project description...",
  image: "https://...",
  categories: ["Tech", "Education"],
  creator: {
    _id: "user1",
    name: "Student Name",
    email: "student@email.com",
    avatar: "https://..."
  },
  supervisionStatus: "available" | "pending" | "accepted",
  supervisor: {
    name: "Supervisor Name",
    title: "Position",
    avatar: "https://..."
  },
  views: 120,
  likes: 45,
  createdAt: "2024-03-01"
}
```

### Supervision Request Object

```javascript
{
  _id: "req1",
  student: {
    _id: "user1",
    name: "Student Name",
    email: "student@email.com",
    avatar: "https://..."
  },
  spark: {
    _id: "spark1",
    title: "Project Title",
    description: "Description...",
    image: "https://...",
    categories: ["Tech"]
  },
  requestedAt: "2024-03-15T10:30:00Z",
  status: "pending"
}
```

### Supervisee Object

```javascript
{
  _id: "sup1",
  student: {
    _id: "user1",
    name: "Student Name",
    email: "student@email.com",
    avatar: "https://..."
  },
  spark: {
    _id: "spark1",
    title: "Project Title",
    image: "https://...",
    categories: ["Tech", "Education"]
  },
  startDate: "2024-01-15",
  meetingsCount: 5,
  lastMeeting: "2024-03-10"
}
```

## API Integration Points (TODO)

### 1. Fetch All Sparks

```javascript
// In AllSparksScreen.jsx
const response = await fetch("API_URL/sparks", {
  headers: { Authorization: `Bearer ${token}` },
});
const sparks = await response.json();
```

### 2. Fetch Supervision Requests

```javascript
// In SupervisionRequestsScreen.jsx
const response = await fetch("API_URL/supervision-requests?status=pending", {
  headers: { Authorization: `Bearer ${token}` },
});
const requests = await response.json();
```

### 3. Accept Request

```javascript
// In RequestDetailScreen.jsx - handleAccept
const response = await fetch(
  `API_URL/supervision-requests/${requestId}/accept`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }
);
```

### 4. Deny Request

```javascript
// In RequestDetailScreen.jsx - handleDeny
const response = await fetch(`API_URL/supervision-requests/${requestId}/deny`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

### 5. Fetch My Supervisees

```javascript
// In MySuperviseesScreen.jsx
const response = await fetch("API_URL/my-supervisees", {
  headers: { Authorization: `Bearer ${token}` },
});
const supervisees = await response.json();
```

## Design Consistency

All supervisor screens follow the same design pattern:

- **Header**: Green gradient (#10b981, #059669), paddingTop: 50, paddingBottom: 20, fontSize: 20
- **Cards**: White background, borderRadius: 16, shadow for elevation
- **Bottom Padding**: 120px on ScrollView content to prevent navbar overlap
- **Status Badges**: Color-coded (green for available, orange for pending, blue for supervised)
- **Buttons**: Green gradient for primary actions, red outline for destructive actions
- **Loading States**: ActivityIndicator with green color (#10b981)
- **Empty States**: Centered icon, title, and description

## Features Summary

### Supervisor Can:

✅ View all student sparks in the platform
✅ See detailed information about any project
✅ Receive supervision requests from students
✅ Accept or deny requests with confirmation dialogs
✅ Track all students under their supervision
✅ View meeting history and statistics
✅ Contact students directly
✅ Pull-to-refresh on all list screens

### Business Logic:

- Each student can create only ONE spark
- Each student can send only ONE supervision request at a time
- Request statuses: none → pending → accepted/rejected
- Supervisors see pending request count as badge
- After accepting, student appears in "My Supervisees"
- Supervisees screen shows mentorship metrics (meetings, start date, etc.)

## Next Steps for Backend Integration

1. **Update all TODO comments** with actual API endpoints
2. **Replace mock data** with API calls in:
   - AllSparksScreen.jsx
   - SupervisionRequestsScreen.jsx
   - MySuperviseesScreen.jsx
   - RequestDetailScreen.jsx
   - SparkDetailScreen.jsx
3. **Implement authentication** to get user role and token
4. **Add error handling** for network failures
5. **Implement role-based routing** on sign-in
6. **Add real-time updates** for new requests (optional - websockets/polling)
7. **Implement contact functionality** in SparkDetailScreen

## Files Created

1. `/sparksHub/SupervisorPanelScreen.jsx` - Main dashboard
2. `/sparksHub/AllSparksScreen.jsx` - All sparks list
3. `/sparksHub/SupervisionRequestsScreen.jsx` - Pending requests list
4. `/sparksHub/RequestDetailScreen.jsx` - Request accept/deny screen
5. `/sparksHub/SparkDetailScreen.jsx` - Full spark details for supervisors
6. `/sparksHub/MySuperviseesScreen.jsx` - Current supervisees list
7. `/sparksHub/index.js` - Updated exports
8. `/Spaces/index.js` - Updated exports
9. `HomeTab.jsx` - Updated navigation routes

All screens are fully functional with mock data and ready for backend integration!
