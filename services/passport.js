const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      console.log(profile.emails[0].value);

      //const existingUser = await User.findOne({ googleId: profile.id });

      const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            //return to jwt token
          return done(null, existingUser);
        } else {
          const user = await new User({
            googleId: profile.id,
            firstname: profile.name.familyName,
            lastName: profile.name.lastName,
            email: profile.emails[0].value,
          }).save();
          //return to jwt signup
        done(null, user);
        }
      
    }
  )
);
