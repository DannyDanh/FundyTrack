// server/auth/google.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("../config/database");

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
} = process.env;

passport.serializeUser((user, done) => {
  done(null, user.id); // our DB user id
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      "SELECT id, google_id, email, name, avatar_url FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return done(null, false);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email =
          (profile.emails && profile.emails[0] && profile.emails[0].value) ||
          null;
        const name = profile.displayName || null;
        const avatarUrl =
          (profile.photos && profile.photos[0] && profile.photos[0].value) ||
          null;

        const result = await pool.query(
          `
          INSERT INTO users (google_id, email, name, avatar_url)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (google_id)
          DO UPDATE SET email = EXCLUDED.email,
                        name = EXCLUDED.name,
                        avatar_url = EXCLUDED.avatar_url
          RETURNING id, google_id, email, name, avatar_url;
        `,
          [googleId, email, name, avatarUrl]
        );

        return done(null, result.rows[0]);
      } catch (err) {
        done(err);
      }
    }
  )
);
