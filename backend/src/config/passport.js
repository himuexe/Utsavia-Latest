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

        user = await User.findOne({
          'authMethods.email': profile.emails[0].value
        });

        if (user) {
          
          const existingGoogleAuth = user.authMethods.find(
            method => method.provider === 'google'
          );

          if (existingGoogleAuth) {
            existingGoogleAuth.providerId = profile.id;
            await user.save();
            return done(null, user);
          }

          user.authMethods.push({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails[0].value
          });


          if (!user.firstName) user.firstName = profile.name.givenName;
          if (!user.lastName) user.lastName = profile.name.familyName;
          if (!user.primaryEmail) user.primaryEmail = profile.emails[0].value;

          try {
            await user.save();
            return done(null, user);
          } catch (saveError) {
            return done(saveError, null);
          }
        }


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

        try {
          await newUser.save();
          return done(null, newUser);
        } catch (saveError) {
          return done(saveError, null);
        }

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;