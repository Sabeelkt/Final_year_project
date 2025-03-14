var admin = require("firebase-admin");

var serviceAccount = require("../../secret.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = admin;