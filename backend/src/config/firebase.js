var admin = require("firebase-admin");

var serviceAccount = require("../../secret_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
