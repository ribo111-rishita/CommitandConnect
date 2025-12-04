// backend/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const AppleStrategy = require("passport-apple").Strategy;
const User = require("../models/User");

// helper
function ensure(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env var ${name}. Add it to backend/.env`);
  }
}

async function findOrCreateUser({ name, email }) {
  if (!email) return null;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || email.split("@")[0],
      email,
      passwordHash: "oauth-user",
      role: "mentee",
    });
  }
  return user;
}

/* GOOGLE */
if (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CALLBACK) {
  ensure("GOOGLE_CLIENT_ID");
  ensure("GOOGLE_CLIENT_SECRET");
  ensure("GOOGLE_CALLBACK");

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      async (_, __, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const user = await findOrCreateUser({ name, email });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
  console.log("GoogleStrategy configured");
} else {
  console.log("GoogleStrategy skipped — missing env vars");
}

/* FACEBOOK (optional) */
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET && process.env.FACEBOOK_CALLBACK) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["id", "displayName", "emails"],
      },
      async (_, __, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const user = await findOrCreateUser({ name, email });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
  console.log("FacebookStrategy configured");
} else {
  console.log("FacebookStrategy skipped — missing env vars");
}

/* APPLE (optional) */
if (
  process.env.APPLE_CLIENT_ID &&
  process.env.APPLE_TEAM_ID &&
  process.env.APPLE_KEY_ID &&
  process.env.APPLE_PRIVATE_KEY &&
  process.env.APPLE_CALLBACK
) {
  passport.use(
    new AppleStrategy(
      {
        clientID: process.env.APPLE_CLIENT_ID,
        teamID: process.env.APPLE_TEAM_ID,
        callbackURL: process.env.APPLE_CALLBACK,
        keyID: process.env.APPLE_KEY_ID,
        privateKeyString: process.env.APPLE_PRIVATE_KEY,
      },
      async (_, __, profile, done) => {
        try {
          const email = profile.email;
          const name = profile.name?.firstName || "Apple User";
          const user = await findOrCreateUser({ name, email });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
  console.log("AppleStrategy configured");
} else {
  console.log("AppleStrategy skipped — missing env vars");
}

module.exports = passport;
