import { useCallback, useEffect, useRef } from "react";
import { logger } from "@/lib/logger";

export const useNotifications = () => {
  const permissionGranted = useRef(false);

  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        permissionGranted.current = permission === "granted";
      });
    } else if (Notification.permission === "granted") {
      permissionGranted.current = true;
    }
  }, []);

  const sendNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const notificationOptions: NotificationOptions = {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    };

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.showNotification(title, notificationOptions);
          return;
        }
      }

      new Notification(title, notificationOptions);
    } catch (error) {
      logger.warn("Notifikaci se nepodařilo zobrazit.", error);
    }
  }, []);

  const notifyTimerRunning = useCallback((activityName: string, duration: string) => {
    void sendNotification("ClimbFlow - Časovač běží", {
      body: `${activityName}: ${duration}`,
      tag: "timer-running",
      requireInteraction: false,
    });
  }, [sendNotification]);

  const notifySessionComplete = useCallback((activityName: string, points: number) => {
    void sendNotification("🎉 Aktivita dokončena!", {
      body: `${activityName} - získal jsi ${points} bodů`,
      tag: "session-complete",
      requireInteraction: false,
    });
  }, [sendNotification]);

  const notifyMountainCompleted = useCallback((mountainName: string) => {
    void sendNotification("🏔️ Hora zdolána!", {
      body: `Gratulujeme! Zdolal jsi ${mountainName}!`,
      tag: "mountain-complete",
      requireInteraction: true,
    });
  }, [sendNotification]);

  return {
    sendNotification,
    notifyTimerRunning,
    notifySessionComplete,
    notifyMountainCompleted,
    permissionGranted: permissionGranted.current,
  };
};
