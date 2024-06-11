"use client";

import Header from "@/components/Header";
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBOeG7mYOUN1B2frL9X-DzSpmrVkp2yrCc",
  authDomain: "fullstack-stonks.firebaseapp.com",
  projectId: "fullstack-stonks",
  storageBucket: "fullstack-stonks.appspot.com",
  messagingSenderId: "908636619562",
  appId: "1:908636619562:web:1d97ee54940c20b0cb9453",
};

export default function Index() {
  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((err) => {
          console.log("Service Worker registration failed:", err);
        });
    }
  }, []);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3 my-8">
        <Header title="Welcome to Twist!" subTitle="Check out our streams" />
      </div>
    </div>
  );
}
