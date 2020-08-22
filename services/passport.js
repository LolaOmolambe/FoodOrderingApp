const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");


const signToken = (user) => {
 
  return jwt.sign(
    { email: user.email, userId: user._id, role: user.role },

    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

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
      // proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
     

      done(null)''
    }
  )
);
