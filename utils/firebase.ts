"use client";

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { createClient } from "@/utils/supabase/client";

const firebaseConfig = {
  apiKey: "AIzaSyBOeG7mYOUN1B2frL9X-DzSpmrVkp2yrCc",
  authDomain: "fullstack-stonks.firebaseapp.com",
  projectId: "fullstack-stonks",
  storageBucket: "fullstack-stonks.appspot.com",
  messagingSenderId: "908636619562",
  appId: "1:908636619562:web:1d97ee54940c20b0cb9453",
};

async function requestPermission() {
  const supabase = createClient();

  // get user to update FCM Token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const app = initializeApp(firebaseConfig);

      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BGt7Wk8aCGz138VJYzZQvkwbVswsgIxi2uRfQE3M_EavM5C3HyJUc5FxPwlX9gl5PooUEtt3LIkgRHbn5L3aXiQ",
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);

          // update FCM token for user
          if (user) {
            supabase.from("user_public").update({ fcm_token: currentToken }).eq(
              "user_id",
              user.id,
            );
          }
        } else {
          console.log("Can not get token");
        }
      });

      // Handle incoming messages while the app is in the foreground
      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        // Customize the notification here
        const notificationTitle = payload?.notification?.title! || "No Title";
        const notificationOptions = {
          body: payload?.notification?.body,
        };

        if (Notification.permission === "granted") {
          new Notification(notificationTitle, notificationOptions);
        }
      });
    } else {
      console.log("Do not have permission!");
    }
  });
}

requestPermission();
