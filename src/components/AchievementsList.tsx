import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { achievements, Achievement } from "@/data/achievements";
import { TimeSession } from "@/types/mountain";
import { Trophy, Lock } from "lucide-react";
import { differenceInDays, startOfDay } from "date-fns";

interface AchievementsListProps {
  sessions: TimeSession[];
  totalPoints: number;
  completedMountains: string[];
}

export const AchievementsList = ({
  sessions,
  totalPoints,
  completedMountains,
}: AchievementsListProps) => {
  const totalHours = sessions.reduce((acc, s) => acc + s.duration / 3600, 0);
  const sessionsCount = sessions.length;

  const calculateStreak = () => {
    if (sessions.length === 0) return 0;

    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    let streak = 0;
    let currentDate = startOfDay(new Date());

    for (let i = 0; i < 365; i++) {
      const hasSession = sortedSessions.some((s) => {
        const sessionDate = startOfDay(new Date(s.created_at));
        return sessionDate.getTime() === currentDate.getTime();
      });

      if (hasSession) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else if (i === 0) {
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        const hasYesterday = sortedSessions.some((s) => {
          const sessionDate = startOfDay(new Date(s.created_at));
          return sessionDate.getTime() === currentDate.getTime();
        });
        if (hasYesterday) {
          streak++;
          currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  const isAchievementUnlocked = (achievement: Achievement): boolean => {
    switch (achievement.requirement.type) {
      case "total_points":
        return totalPoints >= achievement.requirement.value;
      case "total_hours":
        return totalHours >= achievement.requirement.value;
      case "sessions_count":
        return sessionsCount >= achievement.requirement.value;
      case "mountains_completed":
        return completedMountains.length >= achievement.requirement.value;
      case "streak_days":
        return streak >= achievement.requirement.value;
      default:
        return false;
    }
  };

  const getProgress = (achievement: Achievement): number => {
    let current = 0;
    switch (achievement.requirement.type) {
      case "total_points":
        current = totalPoints;
        break;
      case "total_hours":
        current = totalHours;
        break;
      case "sessions_count":
        current = sessionsCount;
        break;
      case "mountains_completed":
        current = completedMountains.length;
        break;
      case "streak_days":
        current = streak;
        break;
    }
    return Math.min((current / achievement.requirement.value) * 100, 100);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-700 text-white";
      case "silver":
        return "bg-gray-400 text-white";
      case "gold":
        return "bg-yellow-500 text-white";
      case "platinum":
        return "bg-purple-600 text-white";
      default:
        return "bg-muted";
    }
  };

  const unlockedAchievements = achievements.filter(isAchievementUnlocked);
  const lockedAchievements = achievements.filter((a) => !isAchievementUnlocked(a));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Úspěchy ({unlockedAchievements.length}/{achievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {unlockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Odemčené
              </h3>
              <div className="grid gap-3">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-3 border rounded-lg bg-muted/30"
                  >
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <Badge className={getTierColor(achievement.tier)}>
                          {achievement.tier}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Zamčené
              </h3>
              <div className="grid gap-3">
                {lockedAchievements.slice(0, 5).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-3 border rounded-lg opacity-60"
                  >
                    <div className="text-3xl grayscale">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <Badge variant="outline">{achievement.tier}</Badge>
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="mt-2">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${getProgress(achievement)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getProgress(achievement).toFixed(0)}% dokončeno
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};



