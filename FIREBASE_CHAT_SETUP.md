# Firebase Chat Setup Guide

## 1. Install Firebase Admin SDK

```bash
npm install firebase-admin uuid
```

## 2. Environment Variables Setup

Add these variables to your `.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
```

## 3. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database and Realtime Database
4. Go to Project Settings > Service Accounts
5. Generate new private key (downloads JSON file)
6. Copy values from JSON to your .env file

## 4. Initialize Firebase in your main app

Add this to your `index.js` or main app file:

```javascript
const { initializeFirebase } = require("./config/firebase");

// Initialize Firebase
initializeFirebase();
```

## 5. Add Firebase Routes

Add this to your main router file or `index.js`:

```javascript
const firebaseChatRoutes = require("./routes/firebaseChat");
app.use("/api/chat", firebaseChatRoutes);
```

## 6. API Endpoints

### Firebase Chat Endpoints:

- `POST /api/chat/firebase/create-message` - Create new message
- `GET /api/chat/firebase/messages-list?doctor_id=xxx&patient_id=xxx` - Get all messages
- `GET /api/chat/firebase/realtime-messages?doctor_id=xxx&patient_id=xxx` - Get real-time messages
- `GET /api/chat/firebase/by/:id` - Get message by ID
- `PUT /api/chat/firebase/update-message/:id` - Update message
- `DELETE /api/chat/firebase/delete-message/:id` - Delete message
- `PUT /api/chat/firebase/mark-read/:id` - Mark message as read
- `GET /api/chat/firebase/room-info?doctor_id=xxx&patient_id=xxx` - Get chat room info

## 7. Frontend Real-time Connection

For real-time chat, use Firebase Web SDK on frontend:

```javascript
import { getDatabase, ref, onValue } from "firebase/database";

const db = getDatabase();
const chatRoomId = "doctor_id_patient_id"; // sorted IDs
const messagesRef = ref(db, `chatRooms/${chatRoomId}/messages`);

onValue(messagesRef, (snapshot) => {
  const messages = [];
  snapshot.forEach((childSnapshot) => {
    messages.push({
      id: childSnapshot.key,
      ...childSnapshot.val(),
    });
  });
  // Update your chat UI with new messages
});
```

## 8. Features Included

- **Firestore Storage**: Persistent message storage
- **Realtime Database**: Live chat updates
- **Authentication**: All routes protected
- **Message Status**: sent/delivered/read tracking
- **Soft Delete**: Messages marked as inactive instead of permanent deletion
- **Chat Rooms**: Organized by user pairs
- **UUID Support**: Consistent with your existing system

## 9. Database Structure

### Firestore Collection: `chats`

```json
{
  "id": "uuid",
  "sender_id": "uuid",
  "receiver_id": "uuid",
  "message": "string",
  "sender": "string",
  "status": "sent|delivered|read",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "is_active": "boolean"
}
```

### Realtime Database: `chatRooms/{roomId}/messages`

```json
{
  "chatRooms": {
    "doctor_id_patient_id": {
      "messages": {
        "messageKey": {
          "id": "uuid",
          "sender_id": "uuid",
          "receiver_id": "uuid",
          "message": "string",
          "timestamp": 1234567890,
          "firestore_id": "firestoreDocId"
        }
      },
      "lastMessage": {
        "message": "last message text",
        "sender_id": "uuid",
        "timestamp": 1234567890
      }
    }
  }
}
```
