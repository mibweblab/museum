import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRUK4Oc-fVJHuF-ow4h6CAAE5IVtZVuYU",
  authDomain: "museum-d41e7.firebaseapp.com",
  projectId: "museum-d41e7",
  storageBucket: "museum-d41e7.appspot.com",
  messagingSenderId: "479594959153",
  appId: "1:479594959153:web:34a3a71175f45a2b90e010",
  measurementId: "G-ZRF8MN4V8Y",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
export { storage, ref, uploadBytes, getDownloadURL };
