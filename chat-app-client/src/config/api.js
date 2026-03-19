// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://chatapp-backend-46f1.onrender.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
  PROFILE: `${API_BASE_URL}/profile`,
  LOGOUT: `${API_BASE_URL}/logout`,

  // Following
  FOLLOWING_LIST: `${API_BASE_URL}/following-list`,
  FOLLOW: (id) => `${API_BASE_URL}/follow/${id}`,

  // Messages
  MESSAGES: (userId) => `${API_BASE_URL}/messages/${userId}`,
  UNREAD_MESSAGES: `${API_BASE_URL}/messages/unread`,
  MARK_AS_READ: (userId) => `${API_BASE_URL}/messages/mark-as-read/${userId}`,
  SEND_MESSAGE: `${API_BASE_URL}/send`,
  DELETE_ALL_MESSAGES: (userId) => `${API_BASE_URL}/messages/delete-all/${userId}`,
  UPLOAD: `${API_BASE_URL}/upload`,

  // Users & Profile
  USERS: `${API_BASE_URL}/users`,
  UPDATE_PROFILE: `${API_BASE_URL}/update-profile`,
  UPLOAD_PROFILE_PIC: `${API_BASE_URL}/upload-profile-pic`,
};

// Socket.io Configuration
export const SOCKET_URL = API_BASE_URL;
export const SOCKET_OPTIONS = {
  transports: ['websocket', 'polling'],
  withCredentials: true,
};
