import firebase from "firebase/compat/app";
import "firebase/storage";

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//initialize storage uncomment when ready to use
const storage = firebase.storage(); //  Having issues loading anything with this.. we will have to figure it out

export { storage, firebase as default }; //  dont forget to export storage
