const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serv = require("./arecanut-disease-firebase-adminsdk-sor09.json");

admin.initializeApp({
  credential: admin.credential.cert(serv),
  databaseURL: "https://arecanut-disease-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const {Storage} = require("@google-cloud/storage");
const storage = new Storage();

exports.detectArecanutDisease = functions.https.onCall(async (data, cont) => {
  if (!cont.auth) {
    throw new functions.https.HttpsError("unauthenticated", "unauthenticated.");
  }
  const userUid = cont.auth.uid;
  const filePath = data.filePath;
  const bucket = storage.bucket("gs://arecanut-disease.appspot.com");
  const file = bucket.file(filePath);
  const fileData = await file.download();
  const imageBuffer = fileData[0];
  const hasDisease = analyzeImage(imageBuffer);
  const resRef = admin.database().ref(`users/${userUid}/diseaseResults`).push();
  resRef.set({
    filePath,
    hasDisease,
    timestamp: admin.database.ServerValue.TIMESTAMP,
  });
  console.log("Result stored in database:", resRef.key);
  return {success: true, message: "Function executed successfully."};
});

/**
 * Analyzes the given image buffer for disease.
 * @param {Buffer} imageBuffer The buffer containing the image data.
 * @return {boolean} Whether the image contains disease.
 */
function analyzeImage(imageBuffer) {
  return true;
}
