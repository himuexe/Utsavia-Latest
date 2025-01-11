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
        // First check if user already exists with Google auth
        let user = await User.findOne({
          'authMethods': {
            $elemMatch: {
              provider: 'google',
              providerId: profile.id
            }
          }
        });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with the email
        user = await User.findOne({
          'authMethods.email': profile.emails[0].value
        });

        if (user) {
          // Check if Google auth method already exists
          const hasGoogleAuth = user.authMethods.some(
            method => method.provider === 'google' && method.providerId === profile.id
          );

          if (!hasGoogleAuth) {
            // Add Google auth method while preserving existing methods
            user.authMethods.push({
              provider: 'google',
              providerId: profile.id,
              email: profile.emails[0].value
            });

            // Update user profile if needed
            if (!user.firstName) user.firstName = profile.name.givenName;
            if (!user.lastName) user.lastName = profile.name.familyName;

            await user.save();
          }

          return done(null, user);
        }

        // Create new user if no existing user found
        const newUser = new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          primaryEmail: profile.emails[0].value,
          authMethods: [{
            provider: 'google',
            providerId: profile.id,
            email: profile.emails[0].value
          }]
        });

        await newUser.save();
        return done(null, newUser);

      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, null);
      }
    }
  )
);

// These are needed if you're using sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    done(null, user);
  } catch (error) {
    console.error('Deserialize Error:', error);
    done(error, null);
  }
});

module.exports = passport;