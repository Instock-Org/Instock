const constants = require('./constants');

var admin = require("firebase-admin");

var serviceAccount = require(constants.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: constants.FIREBASE_DATABASE_URL
});
