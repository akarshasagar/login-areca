import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; 
import {getFunctions} from "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyAqhnQSItvkrpqRA3LGXievVCM4N8tqO6Y",
  authDomain: "arecanut-disease.firebaseapp.com",
  databaseURL: "https://arecanut-disease-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arecanut-disease",
  storageBucket: "arecanut-disease.appspot.com",
  messagingSenderId: "72137079934",
  appId: "1:72137079934:web:cb478aeaae7f732daaac2f",
  measurementId: "G-3SW8HDDQHH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app); 
const functions = getFunctions(app);

export { auth, db, storage, app,functions }; 
