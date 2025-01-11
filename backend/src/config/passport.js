const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser  = await User.findOne({
          'authMethods': {
            $elemMatch: {
              provider: 'google',
              providerId: profile.id
            }
          }
        });

        if (existingUser ) {
          return done(null, existingUser );
        }

        const userWithEmail = await User.findOne({
          'authMethods': {
            $elemMatch: {
              email: profile.emails[0].value
            }
          }
        });

        if (userWithEmail) {
          userWithEmail.authMethods.push({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails[0].value
          });
          await userWithEmail.save();
          return done(null, userWithEmail);
        }

        const newUser  = new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          primaryEmail: profile.emails[0].value,
          authMethods: [{
            provider: 'google',
            providerId: profile.id,
            email: profile.emails[0].value
          }]
        });

        await newUser .save();
        done(null, newUser );

      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser ((user, done) => {
  done(null, user.id);
});

passport.deserializeUser (async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});