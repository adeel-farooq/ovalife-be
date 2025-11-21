const { v4: uuidv4 } = require("uuid");
const {
  initializeFirebase,
  isFirebaseEnabled,
  getFirestore,
  getRTDB,
  getAdmin,
} = require("../../config/firebase");

// Ensure firebase initialization was attempted (idempotent)
initializeFirebase();

const db = isFirebaseEnabled() ? getFirestore() : null;
const rtdb = isFirebaseEnabled() ? getRTDB() : null;

// Create a new chat message
const createFirebaseChat = async (req, res) => {
  try {
    if (!isFirebaseEnabled()) {
      return res.status(503).json({
        message:
          "Firebase is not configured on the server. Chat functionality is disabled.",
      });
    }

    const { sender_id, receiver_id, message, sender } = req.body || {};

    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({
        message: "sender_id, receiver_id, and message are required",
      });
    }

    const admin = getAdmin();
    const chatData = {
      id: uuidv4(),
      sender_id,
      receiver_id,
      message,
      sender: sender || "Unknown",
      status: "sent",
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now(),
      is_active: true,
    };

    // Create chat room ID (consistent ordering for both users)
    const chatRoomId = [sender_id, receiver_id].sort().join("_");

    // Save to Firestore
    const docRef = await db.collection("chats").add(chatData);

    // Also save to Realtime Database for real-time updates
    await rtdb.ref(`chatRooms/${chatRoomId}/messages`).push({
      ...chatData,
      firestore_id: docRef.id,
      timestamp: getRTDB().ServerValue
        ? getRTDB().ServerValue.TIMESTAMP
        : Date.now(),
    });

    // Update last message in chat room
    await rtdb.ref(`chatRooms/${chatRoomId}/lastMessage`).set({
      message,
      sender_id,
      timestamp: getRTDB().ServerValue
        ? getRTDB().ServerValue.TIMESTAMP
        : Date.now(),
    });

    res.status(201).json({
      message: "Chat message created successfully",
      chat: { ...chatData, firestore_id: docRef.id },
    });
  } catch (error) {
    console.error("Firebase chat creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all messages between two users
const getFirebaseChats = async (req, res) => {
  try {
    if (!isFirebaseEnabled()) {
      return res.status(503).json({
        message:
          "Firebase is not configured on the server. Chat functionality is disabled.",
      });
    }

    const { doctor_id, patient_id } = req.query || {};

    if (!doctor_id || !patient_id) {
      const missingFields = [];
      if (!doctor_id) missingFields.push("doctor_id");
      if (!patient_id) missingFields.push("patient_id");

      return res.status(400).json({
        message: `Missing required field${
          missingFields.length > 1 ? "s" : ""
        }: ${missingFields.join(", ")}.`,
      });
    }

    // Query Firestore for messages between these users
    const chatsRef = db.collection("chats");
    const query1 = chatsRef
      .where("sender_id", "==", doctor_id)
      .where("receiver_id", "==", patient_id)
      .where("is_active", "==", true);

    const query2 = chatsRef
      .where("sender_id", "==", patient_id)
      .where("receiver_id", "==", doctor_id)
      .where("is_active", "==", true);

    const [snapshot1, snapshot2] = await Promise.all([
      query1.get(),
      query2.get(),
    ]);

    const chats = [];

    snapshot1.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    snapshot2.forEach((doc) => {
      chats.push({ id: doc.id, ...doc.data() });
    });

    // Sort by created_at
    chats.sort((a, b) => a.created_at.toDate() - b.created_at.toDate());

    res.status(200).json({
      message: "Firebase chats retrieved successfully",
      chats,
    });
  } catch (error) {
    console.error("Firebase chat fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get messages from Realtime Database (for real-time chat)
const getRealTimeChats = async (req, res) => {
  try {
    if (!isFirebaseEnabled()) {
      return res.status(503).json({
        message:
          "Firebase is not configured on the server. Chat functionality is disabled.",
      });
    }

    const { doctor_id, patient_id } = req.query || {};

    if (!doctor_id || !patient_id) {
      return res.status(400).json({
        message: "doctor_id and patient_id are required",
      });
    }

    const chatRoomId = [doctor_id, patient_id].sort().join("_");

    const snapshot = await rtdb
      .ref(`chatRooms/${chatRoomId}/messages`)
      .orderByChild("timestamp")
      .once("value");

    const chats = [];
    snapshot.forEach((childSnapshot) => {
      chats.push({
        rtdb_id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    res.status(200).json({
      message: "Real-time chats retrieved successfully",
      chats,
      chatRoomId,
    });
  } catch (error) {
    console.error("Real-time chat fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get chat by Firestore document ID
const getFirebaseChatById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("chats").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const chat = { id: doc.id, ...doc.data() };
    res.status(200).json({
      message: "Firebase chat retrieved successfully",
      chat,
    });
  } catch (error) {
    console.error("Firebase chat fetch by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update chat message
const updateFirebaseChat = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = getAdmin();
    const updateData = {
      ...req.body,
      updated_at: admin.firestore.Timestamp.now(),
    };

    await db.collection("chats").doc(id).update(updateData);

    res.status(200).json({ message: "Firebase chat updated successfully" });
  } catch (error) {
    console.error("Firebase chat update error:", error);
    if (error.code === 5) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Soft delete chat message
const deleteFirebaseChat = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = getAdmin();

    await db.collection("chats").doc(id).update({
      is_active: false,
      updated_at: admin.firestore.Timestamp.now(),
    });

    res.status(200).json({ message: "Firebase chat deleted successfully" });
  } catch (error) {
    console.error("Firebase chat delete error:", error);
    if (error.code === 5) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = getAdmin();

    await db.collection("chats").doc(id).update({
      status: "read",
      updated_at: admin.firestore.Timestamp.now(),
    });

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get chat room info for real-time connection
const getChatRoomInfo = async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.query;

    if (!doctor_id || !patient_id) {
      return res.status(400).json({
        message: "doctor_id and patient_id are required",
      });
    }

    const chatRoomId = [doctor_id, patient_id].sort().join("_");

    res.status(200).json({
      message: "Chat room info retrieved successfully",
      chatRoomId,
      realtimeDbPath: `chatRooms/${chatRoomId}/messages`,
    });
  } catch (error) {
    console.error("Chat room info error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createFirebaseChat,
  getFirebaseChats,
  getRealTimeChats,
  getFirebaseChatById,
  updateFirebaseChat,
  deleteFirebaseChat,
  markAsRead,
  getChatRoomInfo,
};
