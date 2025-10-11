const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "ovalife";

async function register(req, res) {
  const { email, password, firstname, lastname } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });

  const exists = await User.findByEmail(email);
  if (exists)
    return res.status(409).json({ error: "Email already registered" });

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await User.create({ email, password_hash, firstname, lastname });
  res.status(201).json(user);
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });

  const user = await User.findByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
}

async function profile(req, res) {
  // req.user set by auth middleware
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

module.exports = { register, login, profile };
