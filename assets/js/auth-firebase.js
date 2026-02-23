/*
  Firebase Auth scaffold for the static site.

  Instructions:
  1. Create a Firebase project at https://console.firebase.google.com/
  2. Enable Email/Password sign-in in Authentication -> Sign-in method.
  3. Copy your web app config and paste into the `firebaseConfig` object below.
  4. Create the demo account `khachhang1@example.com` with password `123456` in the Firebase Console -> Authentication -> Users
     (or enable sign-up and call createDemoUser in the browser once).

  Security notes:
  - This uses the Firebase JS SDK. Real passwords aren't stored in your code or localStorage.
  - Sessions are handled by Firebase and persist across devices when authenticated with the same credentials.
  - For production, restrict allowed origins in Firebase and use HTTPS.
 */

// Paste your Firebase config here. Example keys are placeholders and won't work.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_PROJECT.firebaseapp.com",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_PROJECT.appspot.com",
  messagingSenderId: "REPLACE_WITH_SENDER_ID",
  appId: "REPLACE_WITH_APP_ID"
};

// Initialize Firebase app if not already
function initFirebase() {
  if (!window.firebase) {
    console.error('Firebase SDK not loaded. Add the compat SDK scripts to your HTML.');
    return;
  }
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized (placeholder config). Replace with your project config.');
  }
}

// Sign in using email/password. If username-like input is supplied (no '@'), we'll append @example.com
async function authSignIn(rawUser, password, remember = true) {
  if (!firebase.apps.length) {
    initFirebase();
  }
  const email = rawUser.includes('@') ? rawUser : `${rawUser}@example.com`;

  const persistence = remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
  await firebase.auth().setPersistence(persistence);

  return firebase.auth().signInWithEmailAndPassword(email, password);
}

// Optional helper to create the demo user from the browser (only enable if you trust the environment)
async function createDemoUserIfMissing(rawUser = 'khachhang1', password = '123456') {
  if (!firebase.apps.length) initFirebase();
  const email = rawUser.includes('@') ? rawUser : `${rawUser}@example.com`;
  try {
    // Try to get user by fetching provider data via signIn? Firebase client SDK doesn't list users.
    // Safer approach: attempt to create and ignore if it already exists by catching the error.
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    console.log('Demo user created:', email);
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('Demo user already exists:', email);
    } else {
      console.warn('Could not create demo user (client SDK may be restricted):', err.message);
    }
  }
}

// Expose functions to the global scope so pages can call them
window.initFirebase = initFirebase;
window.authSignIn = authSignIn;
window.createDemoUserIfMissing = createDemoUserIfMissing;
