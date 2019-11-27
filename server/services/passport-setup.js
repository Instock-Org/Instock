const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const constants = require("../constants");

passport.use(
    new GoogleStrategy({
        // options for google strat
        // callbackURL: "",
        clientID: constants.GOOGLE_AUTH_CLIENT_ID,
        clientSecret: constants.GOOGLE_AUTH_SECRET
    }, () => {
    
    })
); 