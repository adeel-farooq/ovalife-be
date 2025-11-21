const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:3000/api/auth/google/callback";

const _isGoogleEnabled = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
if (!_isGoogleEnabled) {
  console.warn(
    "⚠️  Google OAuth credentials not configured. Google OAuth routes will be disabled. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

if (_isGoogleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract user info from Google profile
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;
          const firstName = profile.name?.givenName || "";
          const lastName = profile.name?.familyName || "";
          const profilePicture = profile.photos?.[0]?.value || null;

          if (!email) {
            return done(new Error("No email found in Google profile"), null);
          }

          // Check if user already exists with this Google ID
          let user = await User.findOne({
            where: { google_id: googleId, oauth_provider: "google" },
          });

          if (user) {
            // Update existing OAuth user with latest tokens
            await user.update({
              oauth_access_token: accessToken,
              oauth_refresh_token: refreshToken,
              profile_picture_url: profilePicture || user.profile_picture_url,
              updated_at: new Date(),
            });
          } else {
            // Check if user exists with same email (regular registration)
            user = await User.findOne({ where: { email } });

            if (user) {
              // Link existing account to Google OAuth
              await user.update({
                google_id: googleId,
                oauth_provider: "google",
                oauth_access_token: accessToken,
                oauth_refresh_token: refreshToken,
                profile_picture_url: profilePicture || user.profile_picture_url,
                updated_at: new Date(),
              });
            } else {
              // Create new user via OAuth
              user = await User.create({
                email,
                google_id: googleId,
                oauth_provider: "google",
                oauth_access_token: accessToken,
                oauth_refresh_token: refreshToken,
                first_name: firstName,
                last_name: lastName,
                profile_picture_url: profilePicture,
                is_active: true,
                type: "guest",
                password: null, // OAuth users don't have passwords
                created_at: new Date(),
              });
            }
          }

          return done(null, user);
        } catch (error) {
          console.error("Google OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );
}

// expose flag on passport instance
passport.isGoogleEnabled = _isGoogleEnabled;

module.exports = passport;
