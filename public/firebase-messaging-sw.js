console.log("ENTERING SERVICE WORKER");

importScripts(
  "https://www.gstatic.com/firebasejs/9.9.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.9.1/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBOeG7mYOUN1B2frL9X-DzSpmrVkp2yrCc",
  authDomain: "fullstack-stonks.firebaseapp.com",
  projectId: "fullstack-stonks",
  storageBucket: "fullstack-stonks.appspot.com",
  messagingSenderId: "908636619562",
  appId: "1:908636619562:web:1d97ee54940c20b0cb9453",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
