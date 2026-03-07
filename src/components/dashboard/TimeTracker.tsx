import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logger } from "@/lib/logger";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, Square, Bell, BellOff, Volume2, VolumeX } from "lucide-react";
import { Activity } from "@/types/mountain";
import { defaultActivities } from "@/data/activities";
import { toast } from "sonner";
import { useTimerPersist } from "@/hooks/useTimerPersist";
import { useNotifications } from "@/hooks/useNotifications";
import { useSound } from "@/hooks/useSound";
import { TIME, calculatePoints, getRandomMessage, MOTIVATIONAL_MESSAGES } from "@/config/constants";

interface TimeTrackerProps {
  onSessionComplete: (activityId: string, duration: number, points: number) => void;
}

export const TimeTracker = ({ onSessionComplete }: TimeTrackerProps) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { playSound, toggleSound, isSoundEnabled } = useSound();
  const [soundEnabled, setSoundEnabled] = useState(() => isSoundEnabled());
  const lastNotificationTime = useRef(0);

  const { clearPersistedState } = useTimerPersist(
    selectedActivity?.id || null,
    seconds,
    isRunning,
    isPaused,
    setSeconds,
    setSelectedActivity,
    defaultActivities,
    setIsRunning,
    setIsPaused
  );

  const { notifyTimerRunning, notifySessionComplete } = useNotifications();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, TIME.TIMER_UPDATE_INTERVAL_MS);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (isRunning && !isPaused && notificationsEnabled && selectedActivity) {
      const now = Date.now();
      const timeSinceLastNotification = now - lastNotificationTime.current;
      
      if (timeSinceLastNotification >= TIME.NOTIFICATION_INTERVAL_MS) {
        notifyTimerRunning(selectedActivity.name, formatTime(seconds));
        lastNotificationTime.current = now;
      }
    }
  }, [seconds, isRunning, isPaused, notificationsEnabled, selectedActivity, notifyTimerRunning]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / TIME.SECONDS_IN_HOUR);
    const minutes = Math.floor((totalSeconds % TIME.SECONDS_IN_HOUR) / TIME.SECONDS_IN_MINUTE);
    const secs = totalSeconds % TIME.SECONDS_IN_MINUTE;
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  };

  const handleStart = () => {
    if (!selectedActivity) {
      toast.error("Nejprve vyber aktivitu");
      return;
    }
    
    setIsRunning(true);
    setIsPaused(false);
    lastNotificationTime.current = Date.now();
    playSound("start");
    toast.success(`Začal jsi: ${selectedActivity.name}`);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    playSound("pause");
    toast.info(isPaused ? "Pokračuješ" : "Pozastaveno");
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.info(
      notificationsEnabled ? "Notifikace vypnuty" : "Notifikace zapnuty"
    );
  };

  const toggleSoundEffects = () => {
    const newValue = toggleSound();
    setSoundEnabled(newValue);
    toast.info(newValue ? "Zvuky zapnuty" : "Zvuky vypnuty");
  };

  const handleStop = () => {
    if (!selectedActivity) return;
    
    if (seconds < TIME.MIN_SESSION_DURATION_SECONDS) {
      toast.error(`Timer musí běžet alespoň ${TIME.MIN_SESSION_DURATION_SECONDS} sekund`);
      return;
    }
    
    const points = calculatePoints(seconds, selectedActivity.pointsPerHour);

    onSessionComplete(selectedActivity.id, seconds, points);
    
    playSound("stop");
    notifySessionComplete(selectedActivity.name, points);
    
    clearPersistedState();

    const motivationalMessage = getRandomMessage(MOTIVATIONAL_MESSAGES.SESSION_COMPLETE);
    toast.success(`${motivationalMessage} Získal jsi ${points} bodů`, {
      description: `${selectedActivity.name} - ${formatTime(seconds)}`,
    });

    setIsRunning(false);
    setIsPaused(false);
    setSeconds(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Časovač aktivit
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleNotifications}
              title={notificationsEnabled ? "Vypnout notifikace" : "Zapnout notifikace"}
            >
              {notificationsEnabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSoundEffects}
              title={soundEnabled ? "Vypnout zvuky" : "Zapnout zvuky"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select
          value={selectedActivity?.id}
          onValueChange={(value) => {
            const activity = defaultActivities.find((a) => a.id === value);
            setSelectedActivity(activity || null);
          }}
          disabled={isRunning}
        >
          <SelectTrigger>
            <SelectValue placeholder="Vyber aktivitu" />
          </SelectTrigger>
          <SelectContent>
            {defaultActivities.map((activity) => (
              <SelectItem key={activity.id} value={activity.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activity.color }}
                  />
                  {activity.name}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({activity.pointsPerHour} b/h)
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-center py-8">
          <div className="text-6xl font-bold font-mono text-primary">
            {formatTime(seconds)}
          </div>
          {selectedActivity && (
            <p className="text-sm text-muted-foreground mt-2">
              {selectedActivity.category} •{" "}
              {Math.round((seconds / 3600) * selectedActivity.pointsPerHour)} bodů
            </p>
          )}
        </div>

        <div className="flex gap-3">
          {!isRunning ? (
            <Button onClick={handleStart} className="flex-1" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Start
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="secondary"
                className="flex-1"
                size="lg"
              >
                <Pause className="w-5 h-5 mr-2" />
                {isPaused ? "Pokračovat" : "Pauza"}
              </Button>
              <Button
                onClick={handleStop}
                variant="destructive"
                className="flex-1"
                size="lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


