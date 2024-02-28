const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./arecanut-disease-firebase-adminsdk-sor09-58e08ec571.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://arecanut-disease-default-rtdb.asia-southeast1.firebasedatabase.app',
});

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

exports.detectArecanutDisease = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User not authenticated.');
  }

  const userUid = context.auth.uid;
  const filePath = data.filePath;

  const bucket = storage.bucket('gs://arecanut-disease.appspot.com');
  const file = bucket.file(filePath);
  const fileData = await file.download();
  const imageBuffer = fileData[0];

  const hasDisease = analyzeImage(imageBuffer);

  const resultRef = admin.database().ref(`users/${userUid}/diseaseResults`).push();
  resultRef.set({
    filePath,
    hasDisease,
    timestamp: admin.database.ServerValue.TIMESTAMP
  });

  console.log('Result stored in database:', resultRef.key);

  return { success: true, message: 'Function executed successfully.' };
});

function analyzeImage(imageBuffer) {
  // TODO: Add code to call your Arecanut disease detection model here.
  // Return true or false based on whether the image has a disease.
  // You may need to adapt your model code to work in a Cloud Function environment.
  // Ensure that your model is properly loaded.
  return true;
}
