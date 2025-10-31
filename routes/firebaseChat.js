const express = require("express");
const router = express.Router();
const firebaseChatController = require("../controllers/chat/firebase");
const auth = require("../middleware/auth");

// Firebase Chat Routes
router.post(
  "/firebase/create-message",
  auth,
  firebaseChatController.createFirebaseChat
);
router.get(
  "/firebase/messages-list",
  auth,
  firebaseChatController.getFirebaseChats
);
router.get(
  "/firebase/realtime-messages",
  auth,
  firebaseChatController.getRealTimeChats
);
router.get(
  "/firebase/by/:id",
  auth,
  firebaseChatController.getFirebaseChatById
);
router.put(
  "/firebase/update-message/:id",
  auth,
  firebaseChatController.updateFirebaseChat
);
router.delete(
  "/firebase/delete-message/:id",
  auth,
  firebaseChatController.deleteFirebaseChat
);
router.put("/firebase/mark-read/:id", auth, firebaseChatController.markAsRead);
router.get("/firebase/room-info", auth, firebaseChatController.getChatRoomInfo);

module.exports = router;
