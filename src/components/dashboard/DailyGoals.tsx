import { useState } from "react";
import { isToday } from "date-fns";
import { Check, Edit2, Target, X } from "lucide-react";
import { TimeSession } from "@/types/mountain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface DailyGoalsProps {
  sessions: TimeSession[];
}

export const DailyGoals = ({ sessions }: DailyGoalsProps) => {
  const [dailyHoursGoal, setDailyHoursGoal] = useState(() => {
    const saved = localStorage.getItem("climbflow_daily_hours_goal");
    return saved ? parseFloat(saved) : 2;
  });

  const [dailyPointsGoal, setDailyPointsGoal] = useState(() => {
    const saved = localStorage.getItem("climbflow_daily_points_goal");
    return saved ? parseInt(saved) : 100;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempHours, setTempHours] = useState(dailyHoursGoal.toString());
  const [tempPoints, setTempPoints] = useState(dailyPointsGoal.toString());

  const todaySessions = sessions.filter((s) => isToday(new Date(s.created_at)));
  const todayHours = todaySessions.reduce((acc, s) => acc + s.duration / 3600, 0);
  const todayPoints = todaySessions.reduce((acc, s) => acc + s.points, 0);

  const hoursProgress = Math.min((todayHours / dailyHoursGoal) * 100, 100);
  const pointsProgress = Math.min((todayPoints / dailyPointsGoal) * 100, 100);

  const handleSave = () => {
    const hours = parseFloat(tempHours);
    const points = parseInt(tempPoints);

    if (hours > 0 && points > 0) {
      setDailyHoursGoal(hours);
      setDailyPointsGoal(points);
      localStorage.setItem("climbflow_daily_hours_goal", hours.toString());
      localStorage.setItem("climbflow_daily_points_goal", points.toString());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempHours(dailyHoursGoal.toString());
    setTempPoints(dailyPointsGoal.toString());
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Denní cíle
          </div>

          {!isEditing ? (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Check className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Hodiny</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.5"
                min="0.5"
                value={tempHours}
                onChange={(e) => setTempHours(e.target.value)}
                className="w-20 h-8"
              />
            ) : (
              <span className="text-sm font-semibold">
                {todayHours.toFixed(1)} / {dailyHoursGoal}h
              </span>
            )}
          </div>

          <Progress value={hoursProgress} className="h-2" />

          <p className="text-xs text-muted-foreground">
            {hoursProgress >= 100 ? "Cíl splněn." : `Zbývá ${(dailyHoursGoal - todayHours).toFixed(1)}h`}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Body</Label>
            {isEditing ? (
              <Input
                type="number"
                step="10"
                min="10"
                value={tempPoints}
                onChange={(e) => setTempPoints(e.target.value)}
                className="w-20 h-8"
              />
            ) : (
              <span className="text-sm font-semibold">
                {todayPoints} / {dailyPointsGoal}
              </span>
            )}
          </div>

          <Progress value={pointsProgress} className="h-2" />

          <p className="text-xs text-muted-foreground">
            {pointsProgress >= 100 ? "Cíl splněn." : `Zbývá ${dailyPointsGoal - todayPoints} bodů`}
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Dnešní aktivity</span>
            <span className="text-sm font-semibold">{todaySessions.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
