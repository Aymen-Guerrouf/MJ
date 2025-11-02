# Startup Supervision System - Implementation Summary

## Overview

Implemented a complete hackathon-ready startup supervision system where entrepreneurs can create projects, request supervision from qualified supervisors, and have their projects become public upon approval.

## System Architecture

### Workflow

1. **Entrepreneur creates a project** (status: `pending`)
2. **Entrepreneur sends request to supervisor** (project status → `pending_review`)
3. **Supervisor approves/rejects request**
   - If **approved**: Project status → `public` (appears in Sparks Hub)
   - If **rejected**: Project status → `pending` (can request another supervisor)

### Business Rules

- ✅ **One project per user** - Enforced in controller
- ✅ **One pending request per entrepreneur** - Enforced by MongoDB unique index
- ✅ **Status progression**: `pending` → `pending_review` → `public`

---

## API Endpoints

### 1. Startup Ideas Endpoints

#### GET /api/startup-ideas

**Description**: Get all public startup ideas (Sparks Hub)  
**Access**: Public  
**Query Params**:

- `category`: Filter by project category
- `stage`: Filter by project stage
- `search`: Search in title/description

#### POST /api/startup-ideas

**Description**: Create a new startup idea (one per user)  
**Access**: Private (authenticated)  
**Required Fields**:

- `title` (max 100 chars)
- `description` (max 2000 chars)
- `category` (enum: Technology, Education, Healthcare, etc.)
- `problemStatement` (max 1000 chars)
- `solution` (max 1000 chars)
- `targetMarket` (max 500 chars)
- `stage` (optional: idea, prototype, mvp, growth)

#### GET /api/startup-ideas/:id

**Description**: Get single startup idea by ID  
**Access**: Public if status='public', Private for owner/supervisor

#### GET /api/startup-ideas/my-project

**Description**: Get entrepreneur's own project  
**Access**: Private (authenticated)

#### PUT /api/startup-ideas/my-project

**Description**: Update entrepreneur's own project  
**Access**: Private (authenticated)

#### DELETE /api/startup-ideas/my-project

**Description**: Delete entrepreneur's project (cascade deletes progress snaps)  
**Access**: Private (authenticated)

---

### 2. Supervisors Endpoint

#### GET /api/users/supervisors

**Description**: Get all available supervisors  
**Access**: Public  
**Query Params**:

- `expertise`: Filter by supervisor expertise area
- `search`: Search in name, title, or bio

---

### 3. Project Request Endpoints

#### POST /api/project-requests

**Description**: Send supervision request to a supervisor  
**Access**: Private (authenticated)  
**Required Fields**:

- `supervisorId` (MongoDB ObjectId)
- `message` (optional, max 500 chars)

**Validations**:

- User must have a project
- Project must be in `pending` status
- Supervisor must exist and have `isSupervisor: true`
- No duplicate requests for same project-supervisor pair

#### GET /api/project-requests/my-requests

**Description**: Get entrepreneur's sent requests  
**Access**: Private (authenticated)  
**Returns**: Array of requests with populated supervisor and project data

#### GET /api/project-requests/received

**Description**: Get supervisor's received requests  
**Access**: Private (supervisors only)  
**Query Params**:

- `status`: Filter by request status (pending, approved, rejected)

#### PUT /api/project-requests/:id/respond

**Description**: Supervisor responds to request (approve/reject)  
**Access**: Private (supervisors only)  
**Required Fields**:

- `status` (enum: 'approved', 'rejected')
- `responseMessage` (optional, max 500 chars)

**Business Logic**:

- If approved: Update StartupIdea.supervisor and status → 'public'
- If rejected: Update StartupIdea.status → 'pending'

#### DELETE /api/project-requests/:id

**Description**: Cancel a pending request  
**Access**: Private (entrepreneur only)  
**Validation**: Can only cancel pending requests

---

## Database Models

### User Model Extensions

Added supervisor capabilities to existing User model:

```javascript
{
  isSupervisor: Boolean (default: false),
  supervisorTitle: String (e.g., "CEO at StartupX"),
  supervisorBio: String (max 500 chars),
  supervisorExpertise: [String] // 27 professional categories
}
```

**Supervisor Expertise Categories**:

- Business Development
- Marketing & Sales
- Product Management
- AI & Machine Learning
- Fintech
- E-commerce
- Mobile Development
- Web Development
- UI/UX Design
- And 18 more...

### StartupIdea Model Updates

**Category Enum** (12 professional categories):

- Technology, Education, Healthcare, Environment, Innovation, AI, Mobile, Web, Social Impact, Business, Design, Science

**Status Enum**:

- `pending`: Initial state, waiting for request
- `pending_review`: Request sent, waiting for supervisor response
- `public`: Approved by supervisor, visible in Sparks Hub

**Key Fields**:

- `supervisor`: Reference to User (supervisor)
- `owner`: Reference to User (entrepreneur)
- `status`: Project visibility status

### ProjectRequest Model

Tracks supervision requests between entrepreneurs and supervisors:

```javascript
{
  startupIdea: ObjectId ref 'StartupIdea' (required),
  entrepreneur: ObjectId ref 'User' (required),
  supervisor: ObjectId ref 'User' (required),
  message: String (max 500 chars),
  status: 'pending' | 'approved' | 'rejected',
  responseMessage: String,
  respondedAt: Date,
  timestamps: true
}
```

**Indexes**:

- Unique compound index: `{startupIdea, supervisor}` (prevents duplicate requests)
- Partial unique index: `{entrepreneur, status}` where status='pending' (one pending request per user)

---

## Files Created/Modified

### ✅ Created Files

1. `/backend/src/controllers/projectRequestController.js` - 5 functions (270 lines)
2. `/backend/src/routes/projectRequest.routes.js` - Complete routing + validation

### ✅ Modified Files

1. `/backend/src/controllers/startupIdeaController.js` - Complete rewrite (7 functions, 295 lines)
2. `/backend/src/routes/startupIdea.routes.js` - Updated routes to match new endpoints
3. `/backend/src/routes/user.routes.js` - Added GET /supervisors endpoint
4. `/backend/src/routes/index.js` - Registered project-requests routes
5. `/backend/src/models/user.model.js` - Added supervisor fields + virtual populates
6. `/backend/src/models/startupIdea.model.js` - Updated categories enum

---

## Response Format

All endpoints follow consistent response structure:

**Success Response**:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* resource data */
  }
}
```

**Error Response**:

```json
{
  "success": false,
  "message": "Error description"
}
```

**List Response**:

```json
{
  "success": true,
  "count": 10,
  "data": [
    /* array of resources */
  ]
}
```

---

## Testing Recommendations

### Test Workflow

1. ✅ Create user account
2. ✅ Create startup project (POST /api/startup-ideas)
3. ✅ Verify project is in `pending` status
4. ✅ Get list of supervisors (GET /api/users/supervisors)
5. ✅ Send request to supervisor (POST /api/project-requests)
6. ✅ Verify project status is now `pending_review`
7. ✅ Login as supervisor
8. ✅ View received requests (GET /api/project-requests/received)
9. ✅ Approve request (PUT /api/project-requests/:id/respond)
10. ✅ Verify project appears in public list (GET /api/startup-ideas)

### Edge Cases to Test

- ❌ Try creating second project (should fail)
- ❌ Try sending request without project (should fail)
- ❌ Try sending second pending request (should fail due to unique index)
- ❌ Try responding to already-responded request (should fail)
- ✅ Cancel pending request
- ✅ Send request to different supervisor after rejection

---

## Security Considerations

### Authentication & Authorization

- ✅ All write operations require authentication
- ✅ Users can only modify their own projects
- ✅ Supervisors can only respond to requests directed to them
- ✅ Entrepreneurs can only view their own sent requests
- ✅ Public projects visible to everyone

### Validation

- ✅ All inputs validated with express-validator
- ✅ MongoDB ObjectId validation
- ✅ Enum validation for categories and statuses
- ✅ String length limits enforced
- ✅ Supervisor role verification

---

## Next Steps (Optional Enhancements)

### Not Required for Hackathon

- [ ] Add progress snaps functionality
- [ ] Add project metrics/analytics
- [ ] Add supervisor ratings/reviews
- [ ] Add email notifications for request responses
- [ ] Add project search with advanced filters
- [ ] Add supervisor dashboard with statistics
- [ ] Add project collaboration features

---

## Quick Start

### Start Backend Server

```bash
cd backend
npm install
npm start
```

### Environment Variables

Make sure `.env` has:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## Summary

**Total Implementation**:

- ✅ 2 Controllers (12 functions total)
- ✅ 2 Route files (11 endpoints)
- ✅ 3 Model updates
- ✅ Complete validation layer
- ✅ One-project-per-user enforcement
- ✅ Supervisor-entrepreneur workflow
- ✅ Public/private access control

**Status**: Ready for hackathon demo! 🚀
