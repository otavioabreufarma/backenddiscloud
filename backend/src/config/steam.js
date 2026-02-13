const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const {
  steamApiKey,
  steamRealm,
  steamReturnUrl
} = require("./env");

passport.use(
  new SteamStrategy(
    {
      returnURL: steamReturnUrl,
      realm: steamRealm,
      apiKey: steamApiKey
    },
    (identifier, profile, done) => {
      done(null, { steamId64: profile.id });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;