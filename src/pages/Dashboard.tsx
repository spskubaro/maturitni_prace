import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/useAuth";
import { useSound } from "@/hooks/useSound";
import { mountains } from "@/data/mountains";
import { TimeSession } from "@/types/mountain";
import { getFriendlyErrorMessage } from "@/types/errors";
import { TimeTracker } from "@/components/dashboard/TimeTracker";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { DailyGoals } from "@/components/dashboard/DailyGoals";
import { OnboardingTutorial } from "@/components/dashboard/OnboardingTutorial";
import { MountainGallery } from "@/components/mountains/MountainGallery";
import { AchievementsList } from "@/components/AchievementsList";

interface UserProgress {
  user_id: string;
  total_points: number;
  current_mountain_id: string;
  current_mountain_points: number;
  completed_mountains: string[];
  mountain_progress: Record<string, number>;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { playSound } = useSound();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessions, setSessions] = useState<TimeSession[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (progressError) throw progressError;

      const safeProgress: UserProgress = {
        ...progressData,
        current_mountain_points: progressData.current_mountain_points ?? 0,
        mountain_progress: progressData.mountain_progress ?? {},
      };

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("time_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (sessionsError) throw sessionsError;

      setProgress(safeProgress);
      setSessions(sessionsData || []);
    } catch (error) {
      logger.error("Chyba při načítání dat:", error);
      toast.error(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadUserData();
  }, [user, loadUserData]);

  const handleSessionComplete = async (activityId: string, duration: number, points: number) => {
    if (!user || !progress) return;

    try {
      const now = new Date();
      const start = new Date(now.getTime() - duration * 1000);

      const { error: insertError } = await supabase.from("time_sessions").insert({
        user_id: user.id,
        activity_id: activityId,
        start_time: start.toISOString(),
        end_time: now.toISOString(),
        duration,
        points,
      });

      if (insertError) throw insertError;

      const newTotal = progress.total_points + points;
      const currentId = progress.current_mountain_id;
      const currentPoints = (progress.mountain_progress[currentId] ?? progress.current_mountain_points) + points;

      const newMountainProgress = { ...progress.mountain_progress, [currentId]: currentPoints };
      let newCurrentMountainId = currentId;
      let newCurrentMountainPoints = currentPoints;
      const newCompleted = [...progress.completed_mountains];

      const currentMountain = mountains.find((m) => m.id === currentId);
      if (currentMountain && currentPoints >= currentMountain.pointsRequired && !newCompleted.includes(currentId)) {
        newCompleted.push(currentId);
        playSound("mountain");
        toast.success(`Zdolal jsi ${currentMountain.name}!`);

        const sorted = [...mountains].sort((a, b) => a.pointsRequired - b.pointsRequired);
        const i = sorted.findIndex((m) => m.id === currentId);
        if (i >= 0 && i < sorted.length - 1) {
          newCurrentMountainId = sorted[i + 1].id;
          newCurrentMountainPoints = currentPoints - currentMountain.pointsRequired;
        }
      }

      const { error: updateError } = await supabase
        .from("user_progress")
        .update({
          total_points: newTotal,
          current_mountain_id: newCurrentMountainId,
          current_mountain_points: newCurrentMountainPoints,
          completed_mountains: newCompleted,
          mountain_progress: newMountainProgress,
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast.success("Body byly uloženy.");
      await loadUserData();
    } catch (error) {
      logger.error("Chyba při ukládání session:", error);
      toast.error(getFriendlyErrorMessage(error));
    }
  };

  const handleSelectMountain = async (mountainId: string) => {
    if (!user || !progress) return;

    try {
      const currentId = progress.current_mountain_id;
      const currentPoints = progress.current_mountain_points;

      const newMountainProgress = {
        ...progress.mountain_progress,
        [currentId]: currentPoints,
      };

      const restoredPoints = newMountainProgress[mountainId] ?? 0;

      const { error } = await supabase
        .from("user_progress")
        .update({
          current_mountain_id: mountainId,
          current_mountain_points: restoredPoints,
          mountain_progress: newMountainProgress,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Hora byla změněna.");
      await loadUserData();
    } catch (error) {
      logger.error("Chyba při změně hory:", error);
      toast.error(getFriendlyErrorMessage(error));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Načítání...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <OnboardingTutorial />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Tvůj pokrok a statistiky</p>
        </div>

        <div className="mb-8">
          <StatsOverview sessions={sessions} totalPoints={progress.total_points} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <TimeTracker onSessionComplete={handleSessionComplete} />
              <DailyGoals sessions={sessions} />
            </div>

            <MountainGallery
              currentMountainId={progress.current_mountain_id}
              completedMountains={progress.completed_mountains}
              totalPoints={progress.total_points}
              currentMountainPoints={progress.current_mountain_points}
              mountainProgress={progress.mountain_progress}
              onSelectMountain={handleSelectMountain}
            />
          </div>

          <div>
            <AchievementsList
              sessions={sessions}
              totalPoints={progress.total_points}
              completedMountains={progress.completed_mountains}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
