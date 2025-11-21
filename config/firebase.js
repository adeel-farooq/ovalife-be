const admin = require("firebase-admin");

// Internal state
let _initialized = false;
let _enabled = false;
let _admin = null;
let _firestore = null;
let _rtdb = null;

// Helper to check required env vars
const _hasRequiredEnv = () => {
  return (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  );
};

// Initialize Firebase only if required env vars are present.
// If env vars are missing, do not throw — mark Firebase as disabled and return an object indicating that.
const initializeFirebase = () => {
  if (_initialized) {
    return { enabled: _enabled, admin: _admin, db: _firestore, rtdb: _rtdb };
  }

  _initialized = true;

  if (!_hasRequiredEnv()) {
    console.warn(
      "⚠️  Firebase environment variables not found. Firebase features (chat) will be disabled."
    );
    _enabled = false;
    return { enabled: false };
  }

  try {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL:
          process.env.FIREBASE_DATABASE_URL ||
          `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
      });
      console.log("Firebase Admin SDK initialized successfully");
    }

    _admin = admin;
    _firestore = admin.firestore();
    _rtdb = admin.database();
    _enabled = true;

    return { enabled: true, admin: _admin, db: _firestore, rtdb: _rtdb };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Don't throw - keep server running but mark Firebase as disabled
    _enabled = false;
    return { enabled: false, error };
  }
};

const isFirebaseEnabled = () => _enabled;
const getAdmin = () => _admin;
const getFirestore = () => _firestore;
const getRTDB = () => _rtdb;

module.exports = {
  initializeFirebase,
  isFirebaseEnabled,
  getAdmin,
  getFirestore,
  getRTDB,
};
