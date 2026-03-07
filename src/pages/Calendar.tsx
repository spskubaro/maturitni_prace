import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";
import { cs } from "date-fns/locale";
import { defaultActivities } from "@/data/activities";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlannedActivity {
  id: string;
  user_id: string;
  activity_id: string;
  planned_date: string;
  planned_duration: number;
  notes?: string;
  completed: boolean;
  created_at: string;
}

const Calendar = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [plannedActivities, setPlannedActivities] = useState<PlannedActivity[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    activity_id: "",
    planned_duration: 60,
    notes: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const loadPlannedActivities = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from("planned_activities")
        .select("*")
        .eq("user_id", user.id)
        .gte("planned_date", monthStart.toISOString())
        .lte("planned_date", monthEnd.toISOString())
        .order("planned_date", { ascending: true });

      if (error) throw error;
      setPlannedActivities(data || []);
    } catch (error) {
      logger.error("Nepodarilo se nacist aktivity:", error);
      toast.error("Chyba při načítání");
    } finally {
      setLoading(false);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    if (user) {
      loadPlannedActivities();
    }
  }, [user, currentMonth, loadPlannedActivities]);

  const handleCreatePlannedActivity = async () => {
    if (!user || !selectedDate || !formData.activity_id) {
      toast.error("Vyplň všechna pole");
      return;
    }

    try {
      const { error } = await supabase.from("planned_activities").insert({
        user_id: user.id,
        activity_id: formData.activity_id,
        planned_date: selectedDate.toISOString(),
        planned_duration: formData.planned_duration * 60,
        notes: formData.notes,
        completed: false,
      });

      if (error) throw error;

      toast.success("Aktivita naplánována!");
      setIsDialogOpen(false);
      setFormData({ activity_id: "", planned_duration: 60, notes: "" });
      loadPlannedActivities();
    } catch (error) {
      logger.error("Nepodarilo se vytvorit aktivitu:", error);
      toast.error("Chyba při plánování");
    }
  };

  const handleToggleCompleted = async (activityId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("planned_activities")
        .update({ completed: !completed })
        .eq("id", activityId);

      if (error) throw error;

      toast.success(completed ? "Označeno jako nesplněné" : "Označeno jako splněné!");
      loadPlannedActivities();
    } catch (error) {
      logger.error("Nepodarilo se prepnout stav:", error);
      toast.error("Chyba při aktualizaci");
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getActivitiesForDay = (day: Date) => {
    return plannedActivities.filter((activity) =>
      isSameDay(new Date(activity.planned_date), day)
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Kalendář</h1>
          <p className="text-muted-foreground">Plánuj své aktivity a sleduj pokrok</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <CardTitle className="text-2xl">
                {format(currentMonth, "LLLL yyyy", { locale: cs })}
              </CardTitle>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Po", "Út", "St", "Čt", "Pá", "So", "Ne"].map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const dayActivities = getActivitiesForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isDayToday = isToday(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-24 p-2 border rounded-lg transition-all cursor-pointer hover:shadow-md ${
                      !isCurrentMonth ? "bg-muted/30 opacity-50" : "bg-background"
                    } ${isDayToday ? "border-primary border-2" : ""} ${
                      selectedDay && isSameDay(day, selectedDay) ? "bg-accent/20 border-accent" : ""
                    }`}
                    onClick={() => {
                      if (dayActivities.length > 0) {
                        setSelectedDay(day);
                      } else {
                        setSelectedDate(day);
                        setIsDialogOpen(true);
                      }
                    }}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isDayToday ? "text-primary" : ""}`}>
                      {format(day, "d")}
                    </div>

                    <div className="space-y-1 max-h-16 overflow-y-auto">
                      {dayActivities.map((activity) => {
                        const activityData = defaultActivities.find(
                          (a) => a.id === activity.activity_id
                        );
                        return (
                          <div
                            key={activity.id}
                            className={`text-xs p-1 rounded truncate ${
                              activity.completed ? "opacity-50 line-through" : ""
                            }`}
                            style={{
                              backgroundColor: activityData?.color + "20",
                              borderLeft: `3px solid ${activityData?.color}`,
                            }}
                          >
                            {activityData?.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedDay && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Aktivity na {format(selectedDay, "d. MMMM yyyy", { locale: cs })}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDay(null)}
                >
                  Zavřít
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getActivitiesForDay(selectedDay).length > 0 ? (
                  getActivitiesForDay(selectedDay).map((activity) => {
                    const activityData = defaultActivities.find(
                      (a) => a.id === activity.activity_id
                    );
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg"
                      >
                        <Checkbox
                          checked={activity.completed}
                          onCheckedChange={() => handleToggleCompleted(activity.id, activity.completed)}
                        />
                        <div className="flex-1">
                          <div
                            className={`font-medium ${activity.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {activityData?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(activity.planned_duration / 60)} min • {activity.notes || "Bez poznámek"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Žádné aktivity pro tento den
                  </p>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedDate(selectedDay);
                    setIsDialogOpen(true);
                  }}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Přidat aktivitu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Naplánovat aktivitu na {selectedDate && format(selectedDate, "d. MMMM yyyy", { locale: cs })}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Aktivita</Label>
                <Select
                  value={formData.activity_id}
                  onValueChange={(value) => setFormData({ ...formData, activity_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyber aktivitu" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultActivities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Plánovaná délka (minuty)</Label>
                <Input
                  type="number"
                  value={formData.planned_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, planned_duration: parseInt(e.target.value) || 0 })
                  }
                  min={1}
                />
              </div>

              <div>
                <Label>Poznámky (volitelné)</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Např. kapitola 5, cvičení 1-10..."
                />
              </div>

              <Button onClick={handleCreatePlannedActivity} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Naplánovat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Calendar;



