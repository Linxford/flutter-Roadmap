const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
};

exports.onUserCreated = functions.runWith(runtimeOpts).auth.user().onCreate(async (user) => {
  // Create default user settings
  await admin.firestore().collection('settings').doc(user.uid).set({
    theme: 'dark',
    notifications: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
});

exports.onUserDeleted = functions.runWith(runtimeOpts).auth.user().onDelete(async (user) => {
  // Cleanup user data
  const batch = admin.firestore().batch();
  batch.delete(admin.firestore().collection('settings').doc(user.uid));
  batch.delete(admin.firestore().collection('progress').doc(user.uid));
  await batch.commit();
});

// Add more functions as needed
