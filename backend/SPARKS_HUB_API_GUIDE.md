# 🚀 Sparks Hub - Complete API Integration Guide

## Overview

This guide explains the complete flow for the **Sparks Hub** feature where users can:

1. View all public sparks (projects) in the Sparks Hub
2. Create their own spark (one per user)
3. View their spark in their profile
4. Look for supervisors and send supervision requests
5. **Only send ONE pending request at a time**

---

## 📱 User Flow

### 1️⃣ **Sparks Hub Screen** (Public Feed)

**Show all public approved projects**

```http
GET /api/startup-ideas
```

**Query Parameters:**

- `category` (optional): Filter by category
- `stage` (optional): Filter by project stage
- `search` (optional): Search in title/description

**Response:**

```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "AI Study Assistant",
      "description": "An intelligent platform to help students...",
      "category": "AI",
      "images": ["https://cloudinary.com/image1.jpg"],
      "status": "public",
      "owner": {
        "_id": "507f...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "supervisor": {
        "_id": "507f...",
        "name": "Dr. Smith",
        "supervisorTitle": "AI Research Lead"
      },
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
    // ... more sparks
  ]
}
```

**UI Elements:**

- Display cards with: image, title, description, category
- Show "Your Turn" button → Navigate to Create Form
- Show owner name and supervisor (if assigned)

---

### 2️⃣ **Create Spark Form** (After clicking "Your Turn")

**Create a new spark (only if user doesn't have one)**

```http
POST /api/startup-ideas
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "AI-Powered Study Assistant",
  "description": "An intelligent platform that creates personalized study plans",
  "category": "AI",
  "images": ["https://cloudinary.com/my-image.jpg"],
  "problemStatement": "Students struggle to organize their study materials",
  "solution": "AI-powered platform that creates personalized study plans",
  "targetMarket": "University students aged 18-25",
  "businessModel": "SaaS (Subscription)"
}
```

**Required Fields:**

- `title` (max 100 chars)
- `description` (max 500 chars)
- `category` (Technology, Education, Healthcare, Environment, Innovation, AI, Mobile, Web, Social Impact, Business, Design, Science)
- `problemStatement` (max 1000 chars)
- `solution` (max 1000 chars)
- `targetMarket` (max 500 chars)

**Optional Fields:**

- `images` (array of image URLs from Cloudinary)
- `businessModel` (default: "Not Sure Yet")

**Success Response (201):**

```json
{
  "success": true,
  "message": "Startup idea created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "AI-Powered Study Assistant",
    "status": "pending",
    "owner": { ... },
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "message": "You already have a project. You can only create one project at a time."
}
```

---

### 3️⃣ **User Profile - View My Spark**

**Get the current user's spark**

```http
GET /api/startup-ideas/my-project
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "AI Study Assistant",
    "description": "...",
    "category": "AI",
    "images": ["https://..."],
    "problemStatement": "...",
    "solution": "...",
    "targetMarket": "...",
    "businessModel": "SaaS (Subscription)",
    "status": "pending",  // or "pending_review" or "public"
    "owner": { ... },
    "supervisor": null,  // or supervisor object if assigned
    "progressUpdates": [ ... ],
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Error (404):**

```json
{
  "success": false,
  "message": "You do not have a project yet"
}
```

**UI Elements:**

- Show all project details
- Show "Look for Supervisors" button
- Show current status (pending/pending_review/public)
- If status is "pending_review", show "Request sent, waiting for approval"

---

### 4️⃣ **Supervisors List Screen**

**Get all available supervisors**

```http
GET /api/startup-ideas/supervisors
```

**Query Parameters:**

- `expertise` (optional): Filter by expertise area
- `search` (optional): Search in name/title

**Response:**

```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@example.com",
      "supervisorTitle": "AI Research Lead at TechCorp",
      "supervisorBio": "15+ years in AI and machine learning...",
      "supervisorExpertise": ["AI & Machine Learning", "Software Development", "Product Management"]
    }
    // ... more supervisors
  ]
}
```

**UI Elements:**

- Display supervisor cards with: name, title, bio, expertise tags
- Each card has a "Demand Supervision" button
- Click button → Navigate to supervisor detail screen

---

### 5️⃣ **Supervisor Detail Screen**

**Show detailed information about a specific supervisor**

Display the supervisor info from the list above, and show a **"Send Supervision Request"** button.

---

### 6️⃣ **Send Supervision Request** ⚠️ **CRITICAL RULE**

**User can only have ONE pending request at a time**

```http
POST /api/project-requests
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "supervisorId": "507f1f77bcf86cd799439011",
  "message": "I would love your guidance on my AI project. I admire your work in machine learning."
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Project request sent successfully",
  "data": {
    "_id": "607f...",
    "status": "pending",
    "supervisor": { ... },
    "entrepreneur": { ... },
    "startupIdea": { ... },
    "message": "I would love your guidance...",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

**Error Responses:**

❌ **Already has a pending request:**

```json
{
  "success": false,
  "message": "You already have a pending request. You can only send one request at a time."
}
```

❌ **Project not in pending status:**

```json
{
  "success": false,
  "message": "Project must be in pending status to send a request"
}
```

❌ **Already sent to this supervisor:**

```json
{
  "success": false,
  "message": "You have already sent a request to this supervisor for this project"
}
```

❌ **No project found:**

```json
{
  "success": false,
  "message": "You must have a project before sending a request"
}
```

---

### 7️⃣ **View My Sent Requests**

**See all requests the user has sent**

```http
GET /api/project-requests/my-requests
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "607f...",
      "status": "pending", // or "approved" or "rejected"
      "supervisor": {
        "_id": "507f...",
        "name": "Dr. Sarah Johnson",
        "supervisorTitle": "AI Research Lead",
        "supervisorBio": "..."
      },
      "startupIdea": {
        "_id": "507f...",
        "title": "AI Study Assistant",
        "description": "...",
        "category": "AI",
        "status": "pending_review"
      },
      "message": "I would love your guidance...",
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

**UI Logic:**

- If `status === "pending"`: Show "Waiting for response" and allow cancel
- If `status === "approved"`: Show "✓ Approved! Your project is now public"
- If `status === "rejected"`: Show "✗ Rejected. You can send a new request to another supervisor"

---

### 8️⃣ **Cancel Pending Request**

**User can cancel a pending request**

```http
DELETE /api/project-requests/:requestId
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Request cancelled successfully"
}
```

**Error (400):**

```json
{
  "success": false,
  "message": "Can only cancel pending requests"
}
```

---

## 🔄 Complete User Journey

### Scenario 1: New User Creating First Spark

1. **User goes to Sparks Hub** → Sees all public projects
2. **Clicks "Your Turn"** → Opens Create Form
3. **Fills form and submits** → Spark created with `status: "pending"`
4. **Goes to Profile** → Sees their spark with "Look for Supervisors" button
5. **Clicks "Look for Supervisors"** → Sees list of supervisors
6. **Clicks on a supervisor** → Sees supervisor details
7. **Clicks "Send Supervision Request"** → Request sent with `status: "pending"`
8. **Project status changes** to `"pending_review"`
9. **User is BLOCKED** from sending more requests until this one is approved/rejected

### Scenario 2: Request Approved by Supervisor

1. **Supervisor approves** via email link or dashboard
2. **Request status** changes to `"approved"`
3. **Project status** changes to `"public"`
4. **Project supervisor** is assigned
5. **Project appears** in Sparks Hub for everyone to see
6. **User can now see** their project in the public feed

### Scenario 3: Request Rejected by Supervisor

1. **Supervisor rejects** the request
2. **Request status** changes to `"rejected"`
3. **Project status** changes back to `"pending"`
4. **User can now send** a new request to another supervisor

### Scenario 4: User Cancels Pending Request

1. **User goes to "My Requests"** → Sees pending request
2. **Clicks "Cancel Request"**
3. **Request is deleted**
4. **Project status** changes back to `"pending"`
5. **User can now send** a new request to another supervisor

---

## 🎯 Project Status Flow

```
pending (Private - User working on it)
   ↓ (Send request)
pending_review (Request sent, waiting for supervisor)
   ↓ (Approved)          ↓ (Rejected)
public (Visible         pending (Back to private)
in Sparks Hub)
```

---

## 🚨 Important Rules

### ✅ ONE Project Per User

- Users can only create **ONE** project
- If they try to create another, API returns error
- They must **delete** their current project first

### ✅ ONE Pending Request at a Time

- Users can only have **ONE** pending request
- After sending a request, they **cannot** send to another supervisor
- They must wait for:
  - Supervisor to **approve/reject**, OR
  - User to **cancel** the request

### ✅ Project Status Validation

- Can only send request if project status is `"pending"`
- After sending request, status becomes `"pending_review"`
- If approved → `"public"` (visible in Sparks Hub)
- If rejected → `"pending"` (can send new request)

---

## 📋 Frontend Checklist

- [ ] Sparks Hub screen showing all public projects
- [ ] "Your Turn" button navigating to Create Form
- [ ] Create Spark form with all required fields
- [ ] Image upload integration (Cloudinary)
- [ ] User Profile showing "My Spark"
- [ ] "Look for Supervisors" button in profile
- [ ] Supervisors list screen with filters
- [ ] Supervisor detail screen
- [ ] "Send Supervision Request" button
- [ ] Handle "already has pending request" error
- [ ] Show request status in profile
- [ ] "My Requests" screen to view all sent requests
- [ ] Cancel request functionality
- [ ] Disable "Send Request" button when request is pending
- [ ] Show project status badges (pending/pending_review/public)

---

## 🔐 Authentication

All **Private** endpoints require:

```http
Authorization: Bearer <access_token>
```

Get the access token from login/register response and store it securely.

---

## 🎨 UI/UX Recommendations

### Sparks Hub Screen

- Use card grid layout
- Show project images prominently
- Add category badges
- Show supervisor if assigned
- "Your Turn" floating action button

### Create Form

- Multi-step form for better UX
- Image upload with preview
- Category dropdown
- Character counters for text fields
- Validation messages

### Profile - My Spark

- Show full project details
- Status indicator (pending/pending_review/public)
- "Look for Supervisors" button (only if status is "pending")
- If "pending_review": Show "Request sent, waiting for approval"

### Supervisors List

- Search bar
- Expertise filter chips
- Card layout with avatar
- Expertise tags

### Request Status

- Use color coding:
  - 🟡 **Pending** (Yellow)
  - 🟢 **Approved** (Green)
  - 🔴 **Rejected** (Red)

---

## 🧪 Testing Scenarios

1. **Create spark when user has no project** → ✅ Success
2. **Create spark when user already has project** → ❌ Error
3. **Send request when no pending request exists** → ✅ Success
4. **Send request when pending request exists** → ❌ Error "only one at a time"
5. **Cancel pending request** → ✅ Success, can send new one
6. **Try to send to same supervisor twice** → ❌ Error "already sent"
7. **Supervisor approves** → Project becomes public
8. **Supervisor rejects** → Can send new request

---

## 🐛 Error Handling

Always check the `success` field in responses:

```javascript
const response = await fetch('/api/startup-ideas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(formData),
});

const data = await response.json();

if (!data.success) {
  // Show error message to user
  alert(data.message);
} else {
  // Success! Navigate or update UI
  console.log(data.data);
}
```

---

## 📞 Need Help?

Check the Swagger documentation at: `http://localhost:5000/api-docs`

All endpoints are documented with examples!
