import { useCallback, useEffect, useRef } from "react";

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

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });
    }
  }, []);

  const notifyTimerRunning = useCallback((activityName: string, duration: string) => {
    sendNotification("ClimbFlow - Časovač běží", {
      body: `${activityName}: ${duration}`,
      tag: "timer-running",
      requireInteraction: false,
    });
  }, [sendNotification]);

  const notifySessionComplete = useCallback((activityName: string, points: number) => {
    sendNotification("🎉 Session dokončena!", {
      body: `${activityName} - získal jsi ${points} bodů`,
      tag: "session-complete",
      requireInteraction: false,
    });
  }, [sendNotification]);

  const notifyMountainCompleted = useCallback((mountainName: string) => {
    sendNotification("🏔️ Hora zdolána!", {
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

