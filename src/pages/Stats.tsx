import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/useAuth";
import { defaultActivities } from "@/data/activities";
import { Loader2, BarChart3, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { ActivityCharts } from "@/components/stats/ActivityCharts";
import { ActivityHeatmap } from "@/components/stats/ActivityHeatmap";
import { AdvancedStats } from "@/components/stats/AdvancedStats";
import { TimeSession } from "@/types/mountain";

const Stats = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<TimeSession[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const loadSessions = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("time_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      logger.error("Chyba při načítání sessions:", error);
      toast.error("Chyba při načítání");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user, loadSessions]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const categoryStats: Record<string, { time: number; points: number; count: number }> = sessions.reduce((acc, session) => {
    const activity = defaultActivities.find((a) => a.id === session.activity_id)
    if (!activity) return acc // skip pokud neexistuje

    if (!acc[activity.category]) {
      acc[activity.category] = { time: 0, points: 0, count: 0 };
    }
    acc[activity.category].time += session.duration;
    acc[activity.category].points += session.points;
    acc[activity.category].count += 1;
    return acc;
  }, {} as Record<string, { time: number; points: number; count: number }>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Statistiky</h1>
          <p className="text-muted-foreground">Detailní přehled tvého pokroku</p>
        </div>

        <div className="mb-8">
          <ActivityHeatmap sessions={sessions} />
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Přehled
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <TrendingUp className="w-4 h-4 mr-2" />
              Pokročilé
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <ActivityCharts sessions={sessions} />

            <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Celkový čas:</span>
                  <span className="font-semibold">{formatTime(stats.time)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Body:</span>
                  <span className="font-semibold">{stats.points}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Počet aktivit:</span>
                  <span className="font-semibold">{stats.count}</span>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Poslední aktivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 10).map((session) => {
                    const activity = defaultActivities.find(
                      (a) => a.id === session.activity_id
                    );
                    return (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: activity?.color }}
                          />
                          <div>
                            <p className="font-semibold">{activity?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.created_at).toLocaleDateString("cs-CZ", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{session.points} bodů</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(session.duration)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedStats sessions={sessions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Stats;






