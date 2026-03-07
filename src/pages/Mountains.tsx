import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/useAuth";
import { MountainSelector } from "@/components/mountains/MountainSelector";

interface MountainProgress {
  current_mountain_id: string;
  current_mountain_points: number;
  completed_mountains: string[];
  mountain_progress: Record<string, number>;
}

const Mountains = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<MountainProgress | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const loadProgress = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setProgress({
        ...data,
        current_mountain_points: data.current_mountain_points ?? 0,
        mountain_progress: data.mountain_progress ?? {},
      });
    } catch (error) {
      logger.error("Chyba při načítání hor:", error);
      toast.error("Nepodařilo se načíst progress hor.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadProgress();
  }, [user, loadProgress]);

  const handleSelectMountain = async (mountainId: string) => {
    if (!user || !progress) return;

    try {
      const currentId = progress.current_mountain_id;
      const newMountainProgress = {
        ...progress.mountain_progress,
        [currentId]: progress.current_mountain_points,
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

      toast.success("Hora byla vybrána.");
      await loadProgress();
    } catch (error) {
      logger.error("Chyba při změně hory:", error);
      toast.error("Nepodařilo se změnit horu.");
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Výběr hory</h1>
          <p className="text-muted-foreground">Vyber si další vrchol.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <MountainSelector
            currentMountainId={progress.current_mountain_id}
            completedMountains={progress.completed_mountains}
            onSelectMountain={handleSelectMountain}
          />
        </div>
      </div>
    </div>
  );
};

export default Mountains;
