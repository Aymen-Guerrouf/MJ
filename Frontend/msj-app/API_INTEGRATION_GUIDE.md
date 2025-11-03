# 🔌 API Integration Quick Reference

## Backend Base URL

```javascript
const API_BASE_URL = "http://localhost:5000/api"; // Update with your backend URL
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```javascript
const token = await AsyncStorage.getItem("token");

headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
}
```

---

## 📡 API Endpoints

### 1. Startup Ideas (Projects)

#### GET /api/startup-ideas

**Description**: Get all public startup ideas  
**Access**: Public  
**Returns**: Array of public projects (status='public')

```javascript
const response = await fetch(`${API_BASE_URL}/startup-ideas`);
const data = await response.json();
// data.data = [{ _id, title, description, category, images, owner: {name, email}, ... }]
```

---

#### POST /api/startup-ideas

**Description**: Create new startup idea  
**Access**: Private (requires token)  
**Rules**: One project per user

```javascript
const response = await fetch(`${API_BASE_URL}/startup-ideas`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "My Startup",
    description: "Brief description",
    category: "Technology",
    images: ["https://cloudinary.com/image.jpg"],
    problemStatement: "The problem we solve",
    solution: "Our solution",
    targetMarket: "Our customers",
    businessModel: "SaaS (Subscription)",
  }),
});
const data = await response.json();
// data.data = { _id, title, ..., status: 'pending' }
```

---

#### GET /api/startup-ideas/my-project

**Description**: Get current user's project  
**Access**: Private

```javascript
const response = await fetch(`${API_BASE_URL}/startup-ideas/my-project`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
// data.data = { _id, title, ..., status, supervisor }
```

---

#### PUT /api/startup-ideas/my-project

**Description**: Update user's project  
**Access**: Private

```javascript
const response = await fetch(`${API_BASE_URL}/startup-ideas/my-project`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Updated Title",
    description: "Updated description",
    // ... other fields to update
  }),
});
```

---

#### DELETE /api/startup-ideas/my-project

**Description**: Delete user's project  
**Access**: Private

```javascript
const response = await fetch(`${API_BASE_URL}/startup-ideas/my-project`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

### 2. Supervisors

#### GET /api/users/supervisors

**Description**: Get all supervisors  
**Access**: Public  
**Query Params**: `?expertise=AI&search=name`

```javascript
const response = await fetch(`${API_BASE_URL}/users/supervisors`);
const data = await response.json();
// data.data = [{ _id, name, email, supervisorTitle, supervisorBio, supervisorExpertise }]
```

---

### 3. Project Requests

#### POST /api/project-requests

**Description**: Send supervision request  
**Access**: Private  
**Rules**:

- User must have a project
- Project must be in 'pending' status
- One pending request at a time

```javascript
const response = await fetch(`${API_BASE_URL}/project-requests`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    supervisorId: "supervisor_id_here",
    message: "Optional message to supervisor",
  }),
});
const data = await response.json();
// Updates project status to 'pending_review'
// data.data = { _id, supervisor, entrepreneur, startupIdea, status: 'pending' }
```

---

#### GET /api/project-requests/my-requests

**Description**: Get user's sent requests  
**Access**: Private

```javascript
const response = await fetch(`${API_BASE_URL}/project-requests/my-requests`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const data = await response.json();
// data.data = [{ _id, supervisor, startupIdea, status }]
```

---

#### DELETE /api/project-requests/:id

**Description**: Cancel pending request  
**Access**: Private  
**Rules**: Can only cancel pending requests

```javascript
const response = await fetch(`${API_BASE_URL}/project-requests/${requestId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
// Updates project status back to 'pending'
```

---

## 🔄 Status Flow

### Project Status:

```
pending → pending_review → public
```

- **pending**: Created, no supervision request sent
- **pending_review**: Request sent to supervisor, waiting for response
- **public**: Approved by supervisor, visible to everyone

### Request Status:

```
pending → approved/rejected
```

---

## ❌ Error Handling

### Common Error Responses:

```javascript
{
  "success": false,
  "message": "Error description"
}
```

### Error Codes:

- `400` - Bad Request (validation error, business rule violation)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not authorized for this resource)
- `404` - Not Found
- `500` - Server Error

### Example Error Handling:

```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data.data;
} catch (error) {
  console.error("API Error:", error);
  Alert.alert("Error", error.message || "Something went wrong");
}
```

---

## 📤 Image Upload

Images should be uploaded to Cloudinary first, then the URL sent to the backend.

### Example Flow:

```javascript
// 1. Pick image
const result = await ImagePicker.launchImageLibraryAsync({...});
const imageUri = result.assets[0].uri;

// 2. Upload to Cloudinary
const formData = new FormData();
formData.append('file', {
  uri: imageUri,
  type: 'image/jpeg',
  name: 'photo.jpg',
});
formData.append('upload_preset', 'your_upload_preset');

const cloudinaryResponse = await fetch(
  'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
  {
    method: 'POST',
    body: formData,
  }
);
const cloudinaryData = await cloudinaryResponse.json();
const imageUrl = cloudinaryData.secure_url;

// 3. Send URL to backend
const response = await fetch(`${API_BASE_URL}/startup-ideas`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    // ... other fields
    images: [imageUrl]
  })
});
```

---

## 🎯 Integration Checklist

### CreateSparkScreen.jsx

- [ ] Replace AsyncStorage with POST /api/startup-ideas
- [ ] Upload image to Cloudinary first
- [ ] Handle "already have project" error
- [ ] Show success message and navigate

### YourSparkScreen.jsx

- [ ] Replace AsyncStorage with GET /api/startup-ideas/my-project
- [ ] Handle 404 (no project found)
- [ ] Show project details

### SparksHubScreen.jsx

- [ ] Replace mock data with GET /api/startup-ideas
- [ ] Implement pull-to-refresh
- [ ] Handle empty state

### SupervisorsListScreen.jsx

- [ ] Replace mock data with GET /api/users/supervisors
- [ ] Implement search/filter
- [ ] Handle empty state

### SupervisorDetailScreen.jsx

- [ ] Replace local update with POST /api/project-requests
- [ ] Handle errors (no project, not pending, etc.)
- [ ] Refresh YourSparkScreen after success

---

## 💡 Utility Functions

### Create API Service:

```javascript
// services/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = await AsyncStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data.data;
};

// Usage:
import { apiRequest } from "./services/api";

const sparks = await apiRequest("/startup-ideas");
const myProject = await apiRequest("/startup-ideas/my-project");
const supervisors = await apiRequest("/users/supervisors");
```

---

## 🚀 Testing

### Test with Backend Running:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd Frontend/msj-app
npx expo start
```

### Update API_BASE_URL:

```javascript
// For Android Emulator
const API_BASE_URL = "http://10.0.2.2:5000/api";

// For iOS Simulator
const API_BASE_URL = "http://localhost:5000/api";

// For Physical Device (same network)
const API_BASE_URL = "http://192.168.1.X:5000/api";
```

---

**Ready to integrate!** 🎉
