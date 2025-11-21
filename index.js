require("dotenv").config();
const express = require("express");
const apiRouter = require("./routes/api");
const db = require("./db");
const fs = require("fs");
const path = require("path");
const { initializeFirebase } = require("./config/firebase");

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware MUST come first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase
initializeFirebase();

// Session middleware for OAuth (required by passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ovalife-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ovalife-node Express app" });
});

// Register Firebase chat routes (before general /api router to avoid conflicts)
const firebaseChatRoutes = require("./routes/firebaseChat");
app.use("/api/chat", firebaseChatRoutes);

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

async function run() {
  try {
    // ab .sql migrations yahan nahi chalengi, sirf app start hoga
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

run();
