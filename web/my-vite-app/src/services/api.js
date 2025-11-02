import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle 401 errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication failed - 401 Unauthorized");
      // You could also redirect to login here if needed
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ====================
export const login = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const AdminDashboard = async () => {
  try {
    const response = await API.get("/user/admin/dashboard");
    return response.data;
  } catch (error) {
    console.error("Admin dashboard error:", error);
    throw error;
  }
};

export const SuperAdminDashboard = async () => {
  try {
    const response = await API.get("/user/superAdmin/dashboard");
    return response.data;
  } catch (error) {
    console.error("Super admin dashboard error:", error);
    throw error;
  }
};

// ==================== EVENTS ====================
export const getAllEvents = async () => {
  try {
    const response = await API.get("/events");
    return response.data.data;
  } catch (error) {
    console.error("Get events error:", error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await API.get(`/events/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get event error:", error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await API.post("/events", eventData);
    return response.data.data;
  } catch (error) {
    console.error("Create event error:", error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await API.put(`/events/${id}`, eventData);
    return response.data.data;
  } catch (error) {
    console.error("Update event error:", error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await API.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete event error:", error);
    throw error;
  }
};

// ==================== CLUBS ====================
export const getAllClubs = async () => {
  try {
    const response = await API.get("/clubs");
    return response.data.data;
  } catch (error) {
    console.error("Get clubs error:", error);
    throw error;
  }
};

export const getClubById = async (id) => {
  try {
    const response = await API.get(`/clubs/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get club error:", error);
    throw error;
  }
};

export const createClub = async (clubData) => {
  try {
    const response = await API.post("/clubs", clubData);
    return response.data.data;
  } catch (error) {
    console.error("Create club error:", error);
    throw error;
  }
};

export const updateClub = async (id, clubData) => {
  try {
    const response = await API.put(`/clubs/${id}`, clubData);
    return response.data.data;
  } catch (error) {
    console.error("Update club error:", error);
    throw error;
  }
};

export const deleteClub = async (id) => {
  try {
    const response = await API.delete(`/clubs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete club error:", error);
    throw error;
  }
};

// ==================== WORKSHOPS ====================
export const getAllWorkshops = async () => {
  try {
    const response = await API.get("/workshops");
    return response.data.data;
  } catch (error) {
    console.error("Get workshops error:", error);
    throw error;
  }
};

export const getWorkshopById = async (id) => {
  try {
    const response = await API.get(`/workshops/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get workshop error:", error);
    throw error;
  }
};

export const createWorkshop = async (workshopData) => {
  try {
    const response = await API.post("/workshops", workshopData);
    return response.data.data;
  } catch (error) {
    console.error("Create workshop error:", error);
    throw error;
  }
};

export const updateWorkshop = async (id, workshopData) => {
  try {
    const response = await API.put(`/workshops/${id}`, workshopData);
    return response.data.data;
  } catch (error) {
    console.error("Update workshop error:", error);
    throw error;
  }
};

export const deleteWorkshop = async (id) => {
  try {
    const response = await API.delete(`/workshops/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete workshop error:", error);
    throw error;
  }
};

// ==================== VIRTUAL SCHOOL VIDEOS ====================
export const getAllVideos = async () => {
  try {
    const response = await API.get("/virtual-school");
    return response.data.data;
  } catch (error) {
    console.error("Get videos error:", error);
    throw error;
  }
};

export const getVideoById = async (id) => {
  try {
    const response = await API.get(`/virtual-school/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get video error:", error);
    throw error;
  }
};

export const createVideo = async (videoData) => {
  try {
    const response = await API.post("/virtual-school", videoData);
    return response.data.data;
  } catch (error) {
    console.error("Create video error:", error);
    throw error;
  }
};

export const updateVideo = async (id, videoData) => {
  try {
    const response = await API.put(`/virtual-school/${id}`, videoData);
    return response.data.data;
  } catch (error) {
    console.error("Update video error:", error);
    throw error;
  }
};

export const deleteVideo = async (id) => {
  try {
    const response = await API.delete(`/virtual-school/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete video error:", error);
    throw error;
  }
};

// ==================== EXPERIENCE CARDS ====================
export const getAllExperienceCards = async () => {
  try {
    const response = await API.get("/experience-cards");
    return response.data.data;
  } catch (error) {
    console.error("Get experience cards error:", error);
    throw error;
  }
};

export const getExperienceCardById = async (id) => {
  try {
    const response = await API.get(`/experience-cards/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get experience card error:", error);
    throw error;
  }
};

export const createExperienceCard = async (cardData) => {
  try {
    const response = await API.post("/experience-cards", cardData);
    return response.data.data;
  } catch (error) {
    console.error("Create experience card error:", error);
    throw error;
  }
};

export const updateExperienceCard = async (id, cardData) => {
  try {
    const response = await API.put(`/experience-cards/${id}`, cardData);
    return response.data.data;
  } catch (error) {
    console.error("Update experience card error:", error);
    throw error;
  }
};

export const deleteExperienceCard = async (id) => {
  try {
    const response = await API.delete(`/experience-cards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete experience card error:", error);
    throw error;
  }
};

// ==================== EXPERIENCE SESSIONS ====================
export const getAllExperienceSessions = async () => {
  try {
    const response = await API.get("/experience-sessions");
    return response.data.data;
  } catch (error) {
    console.error("Get experience sessions error:", error);
    throw error;
  }
};

export const getExperienceSessionById = async (id) => {
  try {
    const response = await API.get(`/experience-sessions/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Get experience session error:", error);
    throw error;
  }
};

export const createExperienceSession = async (sessionData) => {
  try {
    const response = await API.post("/experience-sessions", sessionData);
    return response.data.data;
  } catch (error) {
    console.error("Create experience session error:", error);
    throw error;
  }
};

export const updateExperienceSession = async (id, sessionData) => {
  try {
    const response = await API.put(`/experience-sessions/${id}`, sessionData);
    return response.data.data;
  } catch (error) {
    console.error("Update experience session error:", error);
    throw error;
  }
};

export const deleteExperienceSession = async (id) => {
  try {
    const response = await API.delete(`/experience-sessions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete experience session error:", error);
    throw error;
  }
};

// ==================== CLOUDINARY UPLOAD ====================
export const uploadToCloudinary = async (file, resourceType = "video") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mjs_test");

    const cloudinaryUrl =
      resourceType === "video"
        ? "https://api.cloudinary.com/v1_1/dcecdcy8v/video/upload"
        : "https://api.cloudinary.com/v1_1/dcecdcy8v/image/upload";

    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export default API;
