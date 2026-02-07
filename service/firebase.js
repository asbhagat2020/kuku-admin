// service/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDC2BczSC778U_mu1Bwf10QdJ3K3XcMf30",
  authDomain: "kuku-e1803.firebaseapp.com",
  projectId: "kuku-e1803",
  storageBucket: "kuku-e1803.appspot.com",
  messagingSenderId: "209500744809",
  appId: "1:209500744809:web:d9f12f075187a973b706f8",
  measurementId: "G-JL2HFVZR4F",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize messaging only in browser
let messaging = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { messaging, getToken, onMessage };