# Frontend-Backend Alignment Guide for Startup Hub (Sparks Hub)

## 🎯 Critical Changes Needed

### 1. Data Structure Alignment

#### Backend StartupIdea Model Fields:

```javascript
{
  title: String (max 100 chars),
  description: String (max 500 chars), // ⚠️ Frontend had 1000
  category: String (single selection), // ⚠️ Frontend had array
  images: [String],
  problemStatement: String (max 1000 chars), // ✅ NEW FIELD
  solution: String (max 1000 chars), // ✅ NEW FIELD
  targetMarket: String (max 500 chars), // ✅ NEW FIELD
  businessModel: String (enum), // ✅ NEW FIELD
  owner: ObjectId,
  supervisor: ObjectId,
  status: 'pending' | 'pending_review' | 'public'
}
```

#### Backend ProjectRequest Model Fields:

```javascript
{
  supervisor: ObjectId,
  entrepreneur: ObjectId,
  startupIdea: ObjectId,
  status: 'pending' | 'approved' | 'rejected',
  message: String (optional),
  responseMessage: String,
  respondedAt: Date
}
```

#### Backend User (Supervisor) Fields:

```javascript
{
  isSupervisor: Boolean,
  supervisorTitle: String,
  supervisorBio: String,
  supervisorExpertise: [String]
}
```

---

## 📝 Required Frontend Updates

### **CreateSparkScreen.jsx** - CRITICAL UPDATES

#### Changes Needed:

1. ✅ **DONE**: Changed `categories` array to `category` single string
2. ✅ **DONE**: Changed description max length from 1000 to 500 chars
3. ⚠️ **TODO**: Add `problemStatement` field (max 1000 chars)
4. ⚠️ **TODO**: Add `solution` field (max 1000 chars)
5. ⚠️ **TODO**: Add `targetMarket` field (max 500 chars)
6. ⚠️ **TODO**: Add `businessModel` dropdown (enum)
7. ⚠️ **TODO**: Update form data structure in `handleSubmit`
8. ⚠️ **TODO**: Update validation to check new required fields

#### Business Model Options:

```javascript
const BUSINESS_MODELS = [
  "SaaS (Subscription)",
  "E-commerce",
  "Marketplace",
  "Ad-Supported",
  "Hardware Sale",
  "Freemium",
  "Service-Based",
  "Not Sure Yet",
  "Other",
];
```

---

### **YourSparkScreen.jsx** - Updates Needed

#### Changes Needed:

1. Update display to show single `category` instead of array
2. Update status handling:
   - `pending` = No supervisor request sent
   - `pending_review` = Request sent, waiting for response
   - `public` = Approved by supervisor
3. Update supervision request status from:
   - `supervisionRequest.status` → Check project `status` field
4. Show supervisor info when status is `public`
5. Update data structure when loading from AsyncStorage/API

#### Status Display Logic:

```javascript
// OLD (incorrect):
supervisionRequest: {
  status: "none" | "pending" | "accepted" | "rejected";
}

// NEW (correct):
status: "pending" | "pending_review" | "public";
supervisor: ObjectId | null;
```

---

### **SparksHubScreen.jsx** - Updates Needed

#### Changes Needed:

1. Fetch only `public` status projects
2. Update display to show single `category` instead of array
3. Update mock data structure to match backend
4. Show `owner` information instead of `creator`

#### API Call:

```javascript
GET / api / startup - ideas;
// Returns only projects with status='public'
```

---

### **SupervisorsListScreen.jsx** - Updates Needed

#### Changes Needed:

1. Update mock data to match backend User model
2. Remove frontend-specific fields:
   - ❌ `availability` (not in backend)
   - ❌ `currentSupervisees` (not in backend)
   - ❌ `maxSupervisees` (not in backend)
   - ❌ `rating` (not in backend)
   - ❌ `totalReviews` (not in backend)
3. Use backend fields:
   - ✅ `name`
   - ✅ `supervisorTitle`
   - ✅ `supervisorBio`
   - ✅ `supervisorExpertise` (array)

#### API Call:

```javascript
GET / api / users / supervisors;
// Returns users with isSupervisor=true
```

---

### **SupervisorDetailScreen.jsx** - Updates Needed

#### Changes Needed:

1. Update to use backend User fields
2. Remove availability checks (not in backend)
3. Update request sending to use correct API endpoint
4. Handle "one pending request" rule

#### API Call:

```javascript
POST /api/project-requests
Body: {
  supervisorId: string,
  message: string (optional)
}

// Response: Creates ProjectRequest and updates StartupIdea.status to 'pending_review'
```

---

## 🔌 API Integration Points

### Required API Endpoints:

1. **GET /api/startup-ideas** - Get all public projects
2. **POST /api/startup-ideas** - Create new project
3. **GET /api/startup-ideas/my-project** - Get user's project
4. **PUT /api/startup-ideas/my-project** - Update user's project
5. **DELETE /api/startup-ideas/my-project** - Delete user's project
6. **GET /api/users/supervisors** - Get all supervisors
7. **POST /api/project-requests** - Send supervision request
8. **GET /api/project-requests/my-requests** - Get user's requests
9. **DELETE /api/project-requests/:id** - Cancel pending request

---

## 🔒 Business Rules to Implement

### 1. One Project Per User

- Enforce in CreateSparkScreen
- Check before allowing create
- API returns error if user already has project

### 2. One Pending Request At a Time

- Disable "Request Supervision" button if request is pending
- Check `project.status === 'pending_review'`
- Show appropriate message

### 3. Status Progression

```
pending → pending_review → public
   ↓           ↓              ↓
Created    Requested      Approved
```

### 4. Request Cannot Be Sent If:

- User doesn't have a project
- Project status is not `pending`
- User already has a pending request

---

## 📦 Data Flow Example

### Creating a Startup:

```javascript
1. User fills CreateSparkScreen form
2. POST /api/startup-ideas
   {
     title, description, category,
     problemStatement, solution, targetMarket,
     businessModel, images: [imageUrl]
   }
3. Backend creates StartupIdea with status='pending'
4. Navigate to YourSparkScreen
```

### Requesting Supervision:

```javascript
1. User views YourSparkScreen (status='pending')
2. Click "Look for Supervisors"
3. Browse SupervisorsListScreen
4. Select supervisor → SupervisorDetailScreen
5. Click "Request Supervision"
6. POST /api/project-requests { supervisorId }
7. Backend creates ProjectRequest
8. Backend updates StartupIdea.status to 'pending_review'
9. User can no longer request other supervisors
```

### Supervisor Approves:

```javascript
1. Supervisor receives request
2. PUT /api/project-requests/:id/respond
   { status: 'approved', responseMessage: '...' }
3. Backend updates:
   - ProjectRequest.status = 'approved'
   - StartupIdea.supervisor = supervisorId
   - StartupIdea.status = 'public'
4. Project now appears in SparksHubScreen
```

---

## ✅ Next Steps

1. **Update CreateSparkScreen**

   - Add 4 new required fields
   - Update validation
   - Update data submission

2. **Update YourSparkScreen**

   - Fix status handling
   - Update data structure

3. **Update SparksHubScreen**

   - Fix category display
   - Update API integration

4. **Update Supervisor Screens**

   - Remove non-existent backend fields
   - Update API integration

5. **Integrate Real APIs**
   - Replace all AsyncStorage with API calls
   - Add token authentication
   - Handle errors properly

---

## 🚀 Priority Order

1. **HIGH**: CreateSparkScreen (form fields)
2. **HIGH**: YourSparkScreen (status handling)
3. **MEDIUM**: SupervisorDetailScreen (request API)
4. **MEDIUM**: SparksHubScreen (data display)
5. **LOW**: SupervisorsListScreen (cosmetic)
