const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");


const signToken = (user) => {
  console.log("signTokem");
  return jwt.sign(
    { email: user.email, userId: user._id, role: user.role },

    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   User.findById(id).then((user) => {
//     done(null, user);
//   });
// });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("herrrr");
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      console.log(profile.emails[0].value);

      //const existingUser = await User.findOne({ googleId: profile.id });

      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        const token = signToken(existingUser);
        return res.status(200).json({
          status: "success",
          token: token,
          expiresIn: 3600,
          userId: existingUser._id,
          userRole: existingUser.role,
        });

        //return to jwt token
        //return done(null, existingUser);
      } else {
        const user = await new User({
          googleId: profile.id,
          firstname: profile.name.familyName,
          lastName: profile.name.lastName,
          email: profile.emails[0].value,
        }).save();

        let token = signToken(user._id);
        //Product.collection.insert
        //Send to user
        //let message = "Welcome on Board";
    
        // await sendEmail({
        //   email: req.body.email,
        //   subject: "Welcome",
        //   message,
        // });
    
        // return res.status(201).json({
        //   status: "success",
        //   token,
        //   data: {
        //     user: user,
        //   },
        // });
        //return to jwt signup
        done(null, user);
      }
    }
  )
);
