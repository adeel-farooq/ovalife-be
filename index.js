require("dotenv").config();
const express = require("express");
const apiRouter = require("./routes/api");
const db = require("./db");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ovalife-node Express app" });
});

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
