



"use client";
import { useEffect, useState } from "react";
import { messaging, getToken } from "../service/firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const FirebaseNotificationSetup = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const authToken = useSelector((state) => state.otp?.token);

  useEffect(() => {
    let isMounted = true;

    const setupNotifications = async () => {
      if (isSetupComplete || !authToken) return;

      try {
        console.log("🚀 Notification setup started...");

        if (!("Notification" in window) || !("serviceWorker" in navigator)) {
          console.log("❌ Browser doesn't support notifications or service workers");
          return;
        }

        // Unregister old service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          if (registration.active?.scriptURL.includes("firebase-messaging")) {
            await registration.unregister();
            console.log("🗑️ Old service worker removed");
          }
        }

        // Register new service worker
        console.log("📝 Registering service worker...");
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );
        console.log("✅ Service worker registered:", registration.scope);

        // Wait for service worker to be active
        if (registration.installing) {
          await new Promise((resolve) => {
            registration.installing.addEventListener("statechange", (e) => {
              if (e.target.state === "activated") resolve();
            });
          });
        }
        await navigator.serviceWorker.ready;
        console.log("✅ Service worker ready");

        // Wait a bit
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!messaging) {
          console.log("⏳ Waiting for messaging to initialize...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          if (!messaging) {
            console.log("❌ Messaging still not available");
            return;
          }
        }
        console.log("✅ Messaging available");

        // Request notification permission
        console.log("🔔 Requesting notification permission...");
        const permission = await Notification.requestPermission();
        console.log("📢 Permission status:", permission);

        if (permission !== "granted") {
          console.log("⚠️ Notification permission not granted");
          toast.warn("Please allow notifications to receive updates!");
          return;
        }

        // Get FCM token
        console.log("⏳ Getting FCM token...");
        const token = await getToken(messaging, {
          vapidKey: "BL9zYvpIJCGEzMBnW2I9Tl8ae_QJ-BsJ6BQLwYxu0GHo-Ua6qcoQGN1S-yLXmE6c8QZTVVM1FfqLbWXbRDhPH1k",
          serviceWorkerRegistration: registration,
        });

        if (!isMounted) return;

        if (token) {
          console.log("✅ FCM Token received:", token);

          // Save token to backend
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/save-fcm-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({ token }),
            });

            if (response.ok) {
              console.log("✅ Token saved to backend");
              toast.success("🔔 Notifications enabled successfully!");
              setIsSetupComplete(true);
            } else {
              const errorData = await response.json().catch(() => ({}));
              console.log("⚠️ Failed to save token:", errorData);
              toast.error(`Failed to save notification token: ${response.status}`);
            }
          } catch (err) {
            console.error("❌ Backend error:", err);
            toast.error("Failed to connect to server");
          }
        } else {
          console.log("❌ No token received from Firebase");
          toast.error("Failed to get notification token");
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("❌ Notification setup error:", error);
        toast.error(`Notification error: ${error.message}`);
      }
    };

    const timer = setTimeout(() => {
      setupNotifications();
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isSetupComplete, authToken]);

  return null;
};

export default FirebaseNotificationSetup;