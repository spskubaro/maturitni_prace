import { useEffect, useRef } from "react";
import { logger } from "@/lib/logger";
import { STORAGE_KEYS } from "@/config/constants";

interface TimerState {
  activityId: string | null;
  seconds: number;
  isRunning: boolean;
  isPaused: boolean;
  lastSavedTime: number;
}

interface PersistedActivityBase {
  id: string;
  name?: string;
}

const STORAGE_KEY = STORAGE_KEYS.TIMER_STATE;

export const useTimerPersist = <TActivity extends PersistedActivityBase>(
  activityId: string | null,
  seconds: number,
  isRunning: boolean,
  isPaused: boolean,
  setSeconds: (seconds: number) => void,
  setSelectedActivity?: (activity: TActivity | null) => void,
  activities?: TActivity[],
  setIsRunning?: (running: boolean) => void,
  setIsPaused?: (paused: boolean) => void
) => {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      loaded.current = true;
      return;
    }

    try {
      const state: TimerState = JSON.parse(raw);

      if (state.activityId && setSelectedActivity && activities) {
        const found = activities.find((a) => a.id === state.activityId);
        if (found) setSelectedActivity(found);
      }

      if (setIsRunning) setIsRunning(state.isRunning);
      if (setIsPaused) setIsPaused(state.isPaused);

      if (state.isRunning && !state.isPaused && state.lastSavedTime) {
        const elapsed = Math.floor((Date.now() - state.lastSavedTime) / 1000);
        setSeconds(state.seconds + elapsed);
      } else {
        setSeconds(state.seconds);
      }

      loaded.current = true;
    } catch (error) {
      logger.error("Chyba při obnově stavu časovače:", error);
      loaded.current = true;
    }
  }, [activities, setIsPaused, setIsRunning, setSeconds, setSelectedActivity]);

  useEffect(() => {
    if (!loaded.current) return;

    if (isRunning || seconds > 0) {
      const state: TimerState = {
        activityId,
        seconds,
        isRunning,
        isPaused,
        lastSavedTime: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activityId, seconds, isRunning, isPaused]);

  const clearPersistedState = () => {
    localStorage.removeItem(STORAGE_KEY);
    loaded.current = false;
  };

  return { clearPersistedState };
};
