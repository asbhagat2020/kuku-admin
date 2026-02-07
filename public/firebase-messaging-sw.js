// public/firebase-messaging-sw.js

importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDC2BczSC778U_mu1Bwf10QdJ3K3XcMf30",
  authDomain: "kuku-e1803.firebaseapp.com",
  projectId: "kuku-e1803",
  storageBucket: "kuku-e1803.appspot.com",
  messagingSenderId: "209500744809",
  appId: "1:209500744809:web:d9f12f075187a973b706f8",
  measurementId: "G-JL2HFVZR4F"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background Message:", payload);
  
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});