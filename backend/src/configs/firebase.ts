import admin from 'firebase-admin';
const serviceAccount = require('../configs/service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

export const auth = admin.auth();