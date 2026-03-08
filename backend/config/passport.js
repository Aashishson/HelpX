const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const BACKEND_URI = process.env.BACKEND_URI;
const User = require("../models/UserModel");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URI}/authGoogle/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      try {
        //finds if user is stored in database or not if user isnt stored it will create the entry for user in the database.
        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { Email: profile.emails[0].value }],
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            googleId: profile.id,
            Email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            Verified: true,
            isLoggedIn: true,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
