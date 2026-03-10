import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Crown, TrendingUp, Mountain, Award } from "lucide-react";
import { mountains } from "@/data/mountains";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth } from "date-fns";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  completed_mountains: string[];
  rank?: number;
  email?: string;
}

type TimeFilter = "all" | "week" | "month";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);

      const leaderboardData: LeaderboardEntry[] = [];

      if (timeFilter === "all") {
        const progressResult = await supabase.rpc("get_leaderboard_data");

        if (progressResult.error) {
        logger.error('Chyba při načítání progressu:', progressResult.error)
          throw progressResult.error
        }

        if (progressResult.data) {
          for (let i = 0; i < progressResult.data.length; i++) {
            const entry = progressResult.data[i]
            leaderboardData.push({
              user_id: entry.user_id,
              total_points: entry.total_points || 0,
              completed_mountains: entry.completed_mountains || [],
            })
          }
        }
      } else {
        const now = new Date();
        let startDate: Date;
        let endDate: Date;

        if (timeFilter === "week") {
          startDate = startOfWeek(now, { weekStartsOn: 1 });
          endDate = endOfWeek(now, { weekStartsOn: 1 });
        } else {
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
        }

        logger.debug(`Načítám leaderboard za ${timeFilter} od ${startDate.toISOString()} do ${endDate.toISOString()}`);

        const periodResult = await supabase.rpc("get_leaderboard_period", {
          start_ts: startDate.toISOString(),
          end_ts: endDate.toISOString(),
        });

        if (periodResult.error) {
          logger.error("Chyba při načítání leaderboardu za období:", periodResult.error);
          throw periodResult.error;
        }

        logger.debug(`Našlo se ${periodResult.data?.length || 0} záznamů v tomto období.`);

        if (!periodResult.data || periodResult.data.length === 0) {
          logger.debug("V tomto období nejsou žádné sessions.");
          setLeaderboard([]);
          setUserRank(null);
          setLoading(false);
          return;
        }

        for (const entry of periodResult.data) {
          leaderboardData.push({
            user_id: entry.user_id,
            total_points: entry.total_points || 0,
            completed_mountains: entry.completed_mountains || [],
          });
        }

        leaderboardData.sort((a, b) => b.total_points - a.total_points);

        logger.debug(`Leaderboard má ${leaderboardData.length} záznamů.`);
      }

      const userIds = leaderboardData.map(entry => entry.user_id)
      const profilesResult = await supabase
        .from("profiles")
        .select("id, username, email")
        .in("id", userIds);

      const leaderboardWithProfiles: LeaderboardEntry[] = []
      for (let i = 0; i < leaderboardData.length; i++) {
        const entry = leaderboardData[i]
        const profile = profilesResult.data?.find((p) => p.id === entry.user_id);
        
        leaderboardWithProfiles.push({
          ...entry,
          rank: i + 1,
          email: profile?.email || profile?.username || "Anonymní uživatel",
        })
      }

      setLeaderboard(leaderboardWithProfiles);

      if (user) {
        let currentUserIndex = -1
        for (let i = 0; i < leaderboardWithProfiles.length; i++) {
          if (leaderboardWithProfiles[i].user_id === user.id) {
            currentUserIndex = i
            break
          }
        }
        if (currentUserIndex >= 0) {
          setUserRank(currentUserIndex + 1)
        } else {
          setUserRank(null)
        }
      }
    } catch (error) {
      logger.error("Chyba při načítání leaderboardu:", error);
    } finally {
      setLoading(false);
    }
  }, [timeFilter, user]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    const progressChannel = supabase
      .channel('leaderboard-progress')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress'
        },
        (_payload: RealtimePostgresChangesPayload<unknown>) => {
          loadLeaderboard();
        }
      )
      .subscribe();

    const sessionsChannel = supabase
      .channel('leaderboard-sessions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'time_sessions'
        },
        (_payload: RealtimePostgresChangesPayload<unknown>) => {

          if (timeFilter !== 'all') {
            loadLeaderboard();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(progressChannel);
      supabase.removeChannel(sessionsChannel);
    };
  }, [timeFilter, loadLeaderboard]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600";
    return "bg-muted";
  };

  const getInitials = (email: string) => {
    return email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getHighestMountain = (completedMountains: string[]) => {
    if (!completedMountains || completedMountains.length === 0) return null;
    
    const completed = mountains.filter((m) =>
      completedMountains.includes(m.id)
    );
    
    return completed.sort((a, b) => b.pointsRequired - a.pointsRequired)[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Žebříček</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Nejlepší horolezci ClimbFlow
          </p>
          <p className="text-sm text-green-500 mt-2">🔴 Live aktualizace</p>
        </div>

        {userRank && (
          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-primary">
                    Tvoje pozice: #{userRank}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={timeFilter} className="mb-6" onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">Celkem</TabsTrigger>
            <TabsTrigger value="week">Týden</TabsTrigger>
            <TabsTrigger value="month">Měsíc</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {leaderboard.map((entry) => {
            const highestMountain = getHighestMountain(entry.completed_mountains);
            const isCurrentUser = user?.id === entry.user_id;

            return (
              <Card
                key={entry.user_id}
                className={`transition-all hover:shadow-lg ${
                  isCurrentUser ? "border-primary/50 bg-primary/5" : ""
                } ${entry.rank && entry.rank <= 3 ? "border-2" : ""}`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-12 sm:w-16 flex justify-center">
                      {entry.rank && getRankIcon(entry.rank)}
                    </div>

                    <Avatar className={`w-10 h-10 sm:w-12 sm:h-12 ${entry.rank && entry.rank <= 3 ? getRankBadgeColor(entry.rank) : ""}`}>
                      <AvatarFallback className={entry.rank && entry.rank <= 3 ? "text-white" : ""}>
                        {getInitials(entry.email || "?")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">
                        {entry.email?.split("@")[0] || "Anonymní"}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-primary">(Ty)</span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 min-w-0">
                        {highestMountain && (
                          <>
                            <Mountain className="w-3 h-3" />
                            <span className="truncate">{highestMountain.name}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-auto text-left sm:text-right flex sm:block items-center justify-between sm:justify-start gap-4">
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        {entry.total_points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">bodů</div>
                      <div className="text-xs text-muted-foreground sm:mt-1">
                        <Award className="w-3 h-3 inline mr-1" />
                        {entry.completed_mountains?.length || 0} hor
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {leaderboard.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                {timeFilter === "all" ? (
                  <p>Zatím žádní uživatelé v žebříčku</p>
                ) : (
                  <div>
                    <p className="mb-2">
                      {timeFilter === "week" 
                        ? "Tento týden ještě nikdo nezískal body" 
                        : "Tento měsíc ještě nikdo nezískal body"}
                    </p>
                    <p className="text-sm">
                      Buď první! Spusť časovač a získej body.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>⚡ Živé aktualizace - vidíš změny okamžitě!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;





