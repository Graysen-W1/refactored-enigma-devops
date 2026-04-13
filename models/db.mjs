// models/db.mjs
// handles Firebase/Firestore connection and exports the database
// source: https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// load the service account key from the path in .env
// source: https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
const serviceAccount = JSON.parse(
  readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// get Firestore database reference
// source: https://firebase.google.com/docs/firestore/quickstart#initialize
const db = admin.firestore();

// source: https://www.w3schools.com/js/js_dates.asp
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
export { db, getTodayDate };
