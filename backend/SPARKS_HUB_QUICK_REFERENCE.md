# 🚀 Sparks Hub - Quick API Reference

## 📋 Endpoints Summary

| Method   | Endpoint                            | Auth | Description                   |
| -------- | ----------------------------------- | ---- | ----------------------------- |
| `GET`    | `/api/startup-ideas`                | No   | Get all public sparks         |
| `POST`   | `/api/startup-ideas`                | ✅   | Create new spark (1 per user) |
| `GET`    | `/api/startup-ideas/:id`            | No\* | Get spark by ID               |
| `GET`    | `/api/startup-ideas/my-project`     | ✅   | Get my spark                  |
| `PUT`    | `/api/startup-ideas/my-project`     | ✅   | Update my spark               |
| `DELETE` | `/api/startup-ideas/my-project`     | ✅   | Delete my spark               |
| `GET`    | `/api/startup-ideas/supervisors`    | No   | Get all supervisors           |
| `POST`   | `/api/project-requests`             | ✅   | Send supervision request      |
| `GET`    | `/api/project-requests/my-requests` | ✅   | Get my sent requests          |
| `DELETE` | `/api/project-requests/:id`         | ✅   | Cancel pending request        |

\*Only public projects are visible without auth. Private projects require ownership.

---

## 🎯 Core Flows

### 1. View Sparks Hub

```javascript
const response = await fetch('/api/startup-ideas');
const data = await response.json();
// data.data = array of public sparks
```

### 2. Create Spark

```javascript
const response = await fetch('/api/startup-ideas', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'AI Study Assistant',
    description: 'An intelligent platform...',
    category: 'AI',
    images: ['https://...'],
    problemStatement: 'Students struggle...',
    solution: 'AI-powered platform...',
    targetMarket: 'University students',
    businessModel: 'SaaS (Subscription)',
  }),
});

const data = await response.json();
if (!data.success) {
  // Error: "You already have a project..."
}
```

### 3. Get My Spark

```javascript
const response = await fetch('/api/startup-ideas/my-project', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
if (data.success) {
  const project = data.data;
  console.log(project.status); // "pending", "pending_review", "public"
}
```

### 4. Get Supervisors

```javascript
const response = await fetch('/api/startup-ideas/supervisors?expertise=AI');
const data = await response.json();
// data.data = array of supervisors
```

### 5. Send Supervision Request ⚠️

```javascript
const response = await fetch('/api/project-requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    supervisorId: '507f1f77bcf86cd799439011',
    message: 'I would love your guidance...',
  }),
});

const data = await response.json();
if (!data.success) {
  // Possible errors:
  // - "You already have a pending request..."
  // - "Project must be in pending status..."
  // - "You have already sent a request to this supervisor..."
  alert(data.message);
}
```

### 6. View My Requests

```javascript
const response = await fetch('/api/project-requests/my-requests', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
// data.data = array of requests with status
data.data.forEach((request) => {
  console.log(request.status); // "pending", "approved", "rejected"
});
```

### 7. Cancel Request

```javascript
const response = await fetch(`/api/project-requests/${requestId}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
// Now can send new request
```

---

## 🚨 Critical Validation Rules

### ✅ Check Before Creating Spark

```javascript
// First check if user already has a project
const checkResponse = await fetch('/api/startup-ideas/my-project', {
  headers: { Authorization: `Bearer ${token}` },
});

if (checkResponse.status === 200) {
  // User already has a project!
  alert('You already have a project. Edit it or delete it first.');
} else {
  // OK to create new project
}
```

### ✅ Check Before Sending Request

```javascript
// Check if user has pending request
const requestsResponse = await fetch('/api/project-requests/my-requests', {
  headers: { Authorization: `Bearer ${token}` },
});

const { data } = await requestsResponse.json();
const hasPendingRequest = data.some((req) => req.status === 'pending');

if (hasPendingRequest) {
  // Disable "Send Request" buttons
  alert('You already have a pending request. Wait or cancel it first.');
}
```

### ✅ Check Project Status Before Showing "Look for Supervisors"

```javascript
const projectResponse = await fetch('/api/startup-ideas/my-project', {
  headers: { Authorization: `Bearer ${token}` },
});

const { data: project } = await projectResponse.json();

if (project.status === 'pending') {
  // Show "Look for Supervisors" button
} else if (project.status === 'pending_review') {
  // Show "Request sent, waiting for approval"
} else if (project.status === 'public') {
  // Show "Project is public" with supervisor info
}
```

---

## 🎨 UI Component States

### Sparks Hub Screen

```jsx
const [sparks, setSparks] = useState([]);

useEffect(() => {
  fetch('/api/startup-ideas')
    .then((res) => res.json())
    .then((data) => setSparks(data.data));
}, []);

return (
  <View>
    {sparks.map((spark) => (
      <SparkCard key={spark._id} spark={spark} />
    ))}
    <FAB onPress={() => navigate('CreateSpark')} />
  </View>
);
```

### My Spark Profile

```jsx
const [project, setProject] = useState(null);
const [hasPendingRequest, setHasPendingRequest] = useState(false);

useEffect(() => {
  // Get project
  fetch('/api/startup-ideas/my-project', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => setProject(data.data));

  // Check for pending requests
  fetch('/api/project-requests/my-requests', {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      const pending = data.data.some((req) => req.status === 'pending');
      setHasPendingRequest(pending);
    });
}, []);

return (
  <View>
    <Text>{project.title}</Text>
    <Text>Status: {project.status}</Text>

    {project.status === 'pending' && !hasPendingRequest && (
      <Button title="Look for Supervisors" onPress={() => navigate('Supervisors')} />
    )}

    {project.status === 'pending_review' && <Text>⏳ Request sent, waiting for approval</Text>}

    {project.status === 'public' && <Text>✅ Project is public!</Text>}
  </View>
);
```

### Supervisor Detail Screen

```jsx
const [supervisor, setSupervisor] = useState(null);
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

const sendRequest = async () => {
  setLoading(true);

  const response = await fetch('/api/project-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      supervisorId: supervisor._id,
      message: message,
    }),
  });

  const data = await response.json();

  if (data.success) {
    Alert.alert('Success', 'Request sent successfully!');
    navigate('MyRequests');
  } else {
    Alert.alert('Error', data.message);
  }

  setLoading(false);
};

return (
  <View>
    <Text>{supervisor.name}</Text>
    <Text>{supervisor.supervisorTitle}</Text>
    <Text>{supervisor.supervisorBio}</Text>

    <TextInput placeholder="Message (optional)" value={message} onChangeText={setMessage} />

    <Button title="Send Supervision Request" onPress={sendRequest} disabled={loading} />
  </View>
);
```

---

## 🧪 Testing Checklist

- [ ] View Sparks Hub without login
- [ ] Create first spark with all fields
- [ ] Try to create second spark (should fail)
- [ ] View "My Spark" in profile
- [ ] Browse supervisors list
- [ ] Filter supervisors by expertise
- [ ] View supervisor details
- [ ] Send supervision request with message
- [ ] Try to send second request (should fail)
- [ ] View request in "My Requests"
- [ ] Cancel pending request
- [ ] Send new request to different supervisor
- [ ] Check status updates after approval
- [ ] Verify project appears in Sparks Hub after approval

---

## 📱 React Native Example (Complete Flow)

```javascript
// 1. Sparks Hub Screen
const SparksHubScreen = () => {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    fetchSparks();
  }, []);

  const fetchSparks = async () => {
    const res = await fetch(`${API_URL}/api/startup-ideas`);
    const data = await res.json();
    setSparks(data.data);
  };

  return (
    <FlatList
      data={sparks}
      renderItem={({ item }) => <SparkCard spark={item} />}
      keyExtractor={(item) => item._id}
    />
  );
};

// 2. Create Spark Screen
const CreateSparkScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    images: [],
    problemStatement: '',
    solution: '',
    targetMarket: '',
    businessModel: 'Not Sure Yet',
  });

  const createSpark = async () => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${API_URL}/api/startup-ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      Alert.alert('Success', 'Spark created!');
      navigation.navigate('Profile');
    } else {
      Alert.alert('Error', data.message);
    }
  };

  return (
    <ScrollView>
      <TextInput
        placeholder="Title"
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />
      {/* ... other fields */}
      <Button title="Create Spark" onPress={createSpark} />
    </ScrollView>
  );
};

// 3. Profile - My Spark
const MySparkScreen = ({ navigation }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProject();
  }, []);

  const fetchMyProject = async () => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${API_URL}/api/startup-ideas/my-project`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (data.success) {
      setProject(data.data);
    }
    setLoading(false);
  };

  if (loading) return <ActivityIndicator />;
  if (!project) return <Text>No project yet</Text>;

  return (
    <View>
      <Image source={{ uri: project.images[0] }} />
      <Text>{project.title}</Text>
      <Text>{project.description}</Text>
      <Text>Status: {project.status}</Text>

      {project.status === 'pending' && (
        <Button title="Look for Supervisors" onPress={() => navigation.navigate('Supervisors')} />
      )}
    </View>
  );
};

// 4. Supervisors List
const SupervisorsScreen = ({ navigation }) => {
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    const res = await fetch(`${API_URL}/api/startup-ideas/supervisors`);
    const data = await res.json();
    setSupervisors(data.data);
  };

  return (
    <FlatList
      data={supervisors}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('SupervisorDetail', { supervisor: item })}
        >
          <View>
            <Text>{item.name}</Text>
            <Text>{item.supervisorTitle}</Text>
            <View>
              {item.supervisorExpertise.map((exp) => (
                <Chip key={exp}>{exp}</Chip>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

// 5. Send Request
const SupervisorDetailScreen = ({ route, navigation }) => {
  const { supervisor } = route.params;
  const [message, setMessage] = useState('');

  const sendRequest = async () => {
    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${API_URL}/api/project-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        supervisorId: supervisor._id,
        message: message,
      }),
    });

    const data = await res.json();

    if (data.success) {
      Alert.alert('Success', 'Request sent!');
      navigation.navigate('Profile');
    } else {
      Alert.alert('Error', data.message);
    }
  };

  return (
    <View>
      <Text>{supervisor.name}</Text>
      <Text>{supervisor.supervisorTitle}</Text>
      <Text>{supervisor.supervisorBio}</Text>

      <TextInput placeholder="Message (optional)" value={message} onChangeText={setMessage} />

      <Button title="Send Request" onPress={sendRequest} />
    </View>
  );
};
```

---

## 🔐 Authentication Setup

```javascript
// Store token after login
await AsyncStorage.setItem('token', data.accessToken);

// Use in requests
const token = await AsyncStorage.getItem('token');

fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 🎯 Status Badge Component

```jsx
const StatusBadge = ({ status }) => {
  const config = {
    pending: { color: '#FFA500', icon: '🔄', text: 'Draft' },
    pending_review: { color: '#FFD700', icon: '⏳', text: 'Under Review' },
    public: { color: '#00C853', icon: '✅', text: 'Public' },
  };

  const { color, icon, text } = config[status];

  return (
    <View style={{ backgroundColor: color, padding: 8, borderRadius: 4 }}>
      <Text>
        {icon} {text}
      </Text>
    </View>
  );
};
```

---

## 📞 Support

- Backend: `http://localhost:5000`
- Swagger Docs: `http://localhost:5000/api-docs`
- Full Guide: `SPARKS_HUB_API_GUIDE.md`
- Visual Flow: `SPARKS_HUB_VISUAL_FLOW.md`
