// Import the functions you need from the SDKs you need
// import firebase from "firebase/app";

import { initializeApp } from "firebase/app";
import { getStorage,ref , uploadBytes, getDownloadURL} from "firebase/storage";


// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC9gXGBZxYXSPo7IiqAStk8YP8b2P_xUU",
  authDomain: "weblab-338617.firebaseapp.com",
  projectId: "weblab-338617",
  storageBucket: "weblab-338617.appspot.com",
  messagingSenderId: "985356557655",
  appId: "1:985356557655:web:67a62ad0acbf1b81237212",
  measurementId: "G-Z27GKJ3PBP"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
export {storage,ref,uploadBytes, getDownloadURL}


// const analytics = getAnalytics(app);

