# Environment Variables Setup

This project uses environment variables to manage API endpoints dynamically. This allows you to easily switch between different environments (development, staging, production).

## Files Created

- `.env` - Default environment variables (production)
- `.env.local` - Local development environment variables (overrides `.env`)
- `src/config/api.js` - Centralized API configuration module

## Environment Variables

### Current Setup

#### `.env` (Production)
```
VITE_API_BASE_URL=https://chatapp-backend-46f1.onrender.com
```

#### `.env.local` (Development - Git Ignored)
```
VITE_API_BASE_URL=http://localhost:8000
```

## How It Works

### 1. **Vite Environment Variables**
- Variables must be prefixed with `VITE_` to be accessible in the browser
- Accessed via `import.meta.env.VITE_API_BASE_URL`

### 2. **Centralized API Configuration**
All endpoints are defined in `src/config/api.js`:

```javascript
export const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/signup`,
  LOGIN: `${API_BASE_URL}/login`,
  PROFILE: `${API_BASE_URL}/profile`,
  // ... and more
};
```

### 3. **Usage in Components**
```javascript
import { API_ENDPOINTS } from "../config/api";

fetch(API_ENDPOINTS.SIGNUP, { /* ... */ });
```

## Switching Environments

### For Development (Local Backend)
Edit `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8000
```

### For Production (Render Backend)
Edit `.env`:
```
VITE_API_BASE_URL=https://chatapp-backend-46f1.onrender.com
```

### For Staging (Custom Backend)
Create `.env.staging`:
```
VITE_API_BASE_URL=https://staging-api.yourdomain.com
```
Then run: `vite --mode staging`

## Running the App

### Development with Local Backend
```bash
npm run dev
# Uses `.env.local` variables
# Backend: http://localhost:8000
```

### Production Build
```bash
npm run build
# Uses `.env` variables
# Backend: https://chatapp-backend-46f1.onrender.com
```

## Updated Files

The following files now use the centralized API configuration:

1. ✅ `src/Components/ChatList.jsx`
2. ✅ `src/Components/feed.jsx`
3. ✅ `src/Auth/Signup.jsx`
4. ✅ `src/context/AuthContext.jsx`
5. ✅ `src/pages/ProfilePage.jsx`

## API Endpoints Reference

All available endpoints in `src/config/api.js`:

```javascript
// Auth
SIGNUP, LOGIN, PROFILE, LOGOUT

// Following
FOLLOWING_LIST, FOLLOW(id)

// Messages
MESSAGES(userId), UNREAD_MESSAGES
MARK_AS_READ(userId), SEND_MESSAGE
DELETE_ALL_MESSAGES(userId), UPLOAD

// Users & Profile
USERS, UPDATE_PROFILE, UPLOAD_PROFILE_PIC
```

## Tips

- Never commit `.env.local` to version control (it's in `.gitignore`)
- Use `.env.local` for sensitive local development secrets
- Keep `.env` for public production values
- Each environment can have its own `.env.{environment}` file
