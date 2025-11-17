# Google OAuth 2.0 Setup Guide

## Overview

This guide will help you set up Google OAuth 2.0 authentication for the Ovalife backend application. Users can sign in with their Google accounts, and the system will automatically create or link their accounts.

## Prerequisites

- Google Cloud Console account
- Ovalife backend application running
- Database access for migrations

---

## Step 1: Google Cloud Console Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select an existing project
3. Name your project (e.g., "Ovalife Backend")
4. Click **"Create"**

### 1.2 Enable Google+ API

1. In the left sidebar, go to **"APIs & Services" > "Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### 1.3 Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "OAuth client ID"**
3. If prompted, configure the OAuth consent screen:

   - Click **"Configure Consent Screen"**
   - Choose **"External"** (or "Internal" for Google Workspace)
   - Fill in the required fields:
     - App name: `Ovalife`
     - User support email: Your email
     - Developer contact: Your email
   - Click **"Save and Continue"**
   - Add scopes: `userinfo.email` and `userinfo.profile`
   - Click **"Save and Continue"**
   - Add test users if in testing mode
   - Click **"Save and Continue"**

4. Back at "Create OAuth client ID":

   - Application type: **"Web application"**
   - Name: `Ovalife Backend OAuth`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:5000
     https://yourdomain.com (production URL)
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/google/callback
     http://localhost:5000/api/auth/google/callback
     https://yourdomain.com/api/auth/google/callback (production)
     ```
   - Click **"Create"**

5. **Copy your credentials:**
   - Client ID (looks like: `123456789-abcdefgh.apps.googleusercontent.com`)
   - Client Secret (looks like: `GOCSPX-abc123def456`)

---

## Step 2: Environment Configuration

### 2.1 Update `.env` File

Add the following variables to your `.env` file:

```env
# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=your-client-id-from-google-console
GOOGLE_CLIENT_SECRET=your-client-secret-from-google-console
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Session Secret (generate a random string)
SESSION_SECRET=your-secure-random-session-secret-here

# JWT Secret (if not already set)
JWT_SECRET=your-jwt-secret-here

# Node Environment
NODE_ENV=development
```

**Example:**

```env
GOOGLE_CLIENT_ID=123456789-abc123def456ghi789jkl.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xyz789abc123def456
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=my-super-secret-session-key-12345
JWT_SECRET=ovalife
NODE_ENV=development
```

---

## Step 3: Install Dependencies

Run the following command to install the required packages:

```bash
npm install
```

This will install:

- `passport`: ^0.7.0
- `passport-google-oauth20`: ^2.0.0
- `express-session`: ^1.18.0

---

## Step 4: Run Database Migration

Execute the migration to add OAuth fields to the users table:

```bash
npm run migrate
```

This will run migration `008_add_oauth_fields.sql` which adds:

- `oauth_provider` (VARCHAR)
- `google_id` (VARCHAR)
- `oauth_access_token` (TEXT)
- `oauth_refresh_token` (TEXT)
- Makes `password` field nullable for OAuth users

---

## Step 5: Start the Server

```bash
npm run dev
```

Your server should start on `http://localhost:3000` (or your configured PORT).

---

## Step 6: Test OAuth Flow

### Option 1: Browser Test

1. Open your browser and navigate to:

   ```
   http://localhost:3000/api/auth/google
   ```

2. You should be redirected to Google's sign-in page

3. Sign in with your Google account

4. After successful authentication, you'll receive a JSON response with:

   ```json
   {
     "success": true,
     "message": "Google authentication successful.",
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": "uuid-here",
       "email": "user@example.com",
       "first_name": "John",
       "last_name": "Doe",
       "profile_picture_url": "https://...",
       "type": "guest",
       "oauth_provider": "google"
     }
   }
   ```

5. Save the JWT token - you'll use it for authenticated API calls

### Option 2: Postman/API Client Test

Since OAuth requires browser redirects, here's how to test:

1. **Initial Request:**

   - Open browser to: `http://localhost:3000/api/auth/google`
   - Complete Google sign-in
   - Copy the JWT token from the response

2. **Test Protected Endpoint:**
   - **Method:** GET
   - **URL:** `http://localhost:3000/api/auth/google/profile`
   - **Headers:**
     ```
     Authorization: Bearer your-jwt-token-here
     ```
   - **Expected Response:**
     ```json
     {
       "success": true,
       "user": {
         "id": "uuid",
         "email": "user@example.com",
         "first_name": "John",
         "last_name": "Doe",
         "profile_picture_url": "https://...",
         "oauth_provider": "google",
         "type": "guest"
       }
     }
     ```

---

## Available Endpoints

### 1. Initiate Google OAuth

**GET** `/api/auth/google`

Redirects user to Google sign-in page.

### 2. OAuth Callback (Automatic)

**GET** `/api/auth/google/callback`

Google redirects here after authentication. Returns JWT token and user data.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Google authentication successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture_url": "https://lh3.googleusercontent.com/a/...",
    "type": "guest",
    "oauth_provider": "google"
  }
}
```

### 3. OAuth Failure

**GET** `/api/auth/google/failure`

Returns error if authentication fails.

**Response (401):**

```json
{
  "success": false,
  "message": "Google authentication failed. Please try again."
}
```

### 4. Get OAuth Profile

**GET** `/api/auth/google/profile`

**Headers:** `Authorization: Bearer <jwt-token>`

Returns authenticated user's profile.

**Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "profile_picture_url": "https://lh3.googleusercontent.com/a/...",
    "oauth_provider": "google",
    "type": "guest"
  }
}
```

---

## How It Works

### New User Flow:

1. User clicks "Sign in with Google"
2. Redirected to Google sign-in
3. User authorizes the app
4. System creates new user account with:
   - Email from Google
   - First/Last name from Google
   - Profile picture from Google
   - `oauth_provider` = "google"
   - `google_id` = Google's unique user ID
   - `password` = NULL (OAuth users don't have passwords)
5. JWT token generated and returned

### Existing User Flow (Same Email):

1. User with email `john@gmail.com` already exists (registered manually)
2. User signs in with Google using same email
3. System links the accounts by adding:
   - `google_id` to existing user
   - `oauth_provider` = "google"
   - OAuth tokens
4. User can now sign in both ways (password or Google)

### Returning OAuth User:

1. User previously signed in with Google
2. System finds user by `google_id`
3. Updates OAuth tokens
4. Generates new JWT token
5. Returns user data

---

## Security Features

✅ **Secure Token Storage:** OAuth access/refresh tokens stored encrypted in database  
✅ **JWT Authentication:** Industry-standard JWT tokens for API access  
✅ **Session Management:** Express sessions with configurable expiry  
✅ **HTTPS in Production:** Cookies marked secure in production mode  
✅ **Password Optional:** OAuth users don't need passwords  
✅ **Account Linking:** Automatically links OAuth to existing email accounts

---

## Frontend Integration

### Example: React Integration

```javascript
// Initiate Google OAuth
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:3000/api/auth/google";
};

// OAuth callback page (e.g., /oauth-callback)
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    // Store token
    localStorage.setItem("authToken", token);

    // Redirect to dashboard
    window.location.href = "/dashboard";
  }
}, []);

// Use token for API calls
const fetchUserData = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch("http://localhost:3000/api/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
};
```

### Example: Button Component

```jsx
<button onClick={handleGoogleLogin}>
  <img src="/google-icon.svg" alt="Google" />
  Sign in with Google
</button>
```

---

## Production Deployment

### 1. Update Environment Variables

```env
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback
NODE_ENV=production
SESSION_SECRET=generate-strong-random-string
```

### 2. Update Google Console

- Add production URLs to authorized origins and redirect URIs
- Example: `https://api.yourdomain.com`

### 3. Enable HTTPS

- Session cookies will automatically be secure in production
- Ensure your server has valid SSL certificate

---

## Troubleshooting

### Issue: "Redirect URI mismatch"

**Solution:** Ensure the callback URL in Google Console exactly matches `GOOGLE_CALLBACK_URL` in `.env`

### Issue: "No email found in Google profile"

**Solution:** Ensure you've added `email` scope in Google Console OAuth consent screen

### Issue: "Client ID not configured"

**Solution:** Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`

### Issue: "Session undefined"

**Solution:** Ensure `express-session` middleware is initialized before passport in `index.js`

### Issue: "Cannot find user after OAuth"

**Solution:** Check database connection and ensure migration ran successfully

---

## Database Schema

The migration adds these fields to the `users` table:

| Column                | Type            | Description                  |
| --------------------- | --------------- | ---------------------------- |
| `oauth_provider`      | VARCHAR(50)     | Provider name ("google")     |
| `google_id`           | VARCHAR(255)    | Unique Google user ID        |
| `oauth_access_token`  | TEXT            | Google access token          |
| `oauth_refresh_token` | TEXT            | Google refresh token         |
| `password`            | TEXT (nullable) | Now nullable for OAuth users |

**Indexes:**

- `idx_users_google_id` on `google_id`
- `idx_users_oauth_provider` on `oauth_provider`

---

## Support

For issues or questions:

1. Check Google Cloud Console for correct configuration
2. Verify environment variables are set correctly
3. Check server logs for detailed error messages
4. Ensure database migration completed successfully

---

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Express Session Documentation](https://github.com/expressjs/session)
