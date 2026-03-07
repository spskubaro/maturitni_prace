import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Download, User, Mail, Trash2 } from "lucide-react";
import { defaultActivities } from "@/data/activities";
import { TimeSession } from "@/types/mountain";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileProgress {
  total_points: number;
  completed_mountains: string[];
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [progress, setProgress] = useState<ProfileProgress | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const loadUserData = useCallback(async () => {
    if (!user) return

    try {
      const [sessionsRes, progressRes] = await Promise.all([
        supabase
          .from("time_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .single(),
      ]);

      if (sessionsRes.error) throw sessionsRes.error;
      if (progressRes.error) throw progressRes.error;

      setSessions(sessionsRes.data || []);
      setProgress(progressRes.data);
    } catch (error) {
      logger.error("Chyba při načítání dat:", error);
      toast.error("Chyba při načítání dat");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  const exportData = () => {
    logger.debug('Exportuju data...')
    const data = {
      user: {
        email: user?.email,
        created_at: user?.created_at,
      },
      progress,
      sessions: sessions.map((s) => ({
        ...s,
        activity_name: defaultActivities.find((a) => a.id === s.activity_id)?.name,
      })),
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `climbflow-export-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Data exportována!");
  };

  const exportCSV = () => {
    const headers = ["Datum", "Aktivita", "Kategorie", "Trvání (s)", "Body"];
    const rows = sessions.map((s) => {
      const activity = defaultActivities.find((a) => a.id === s.activity_id);
      return [
        new Date(s.created_at).toLocaleString("cs-CZ"),
        activity?.name || "Neznámá",
        activity?.category || "Neznámá",
        s.duration,
        s.points,
      ];
    });

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `climbflow-sessions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("CSV exportováno!");
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      
      const { error } = await supabase.rpc('delete_user_account');
      
      if (error) {
        logger.error('Chyba při mazani uctu:', error)
        toast.error("Chyba při mazání účtu");
        return;
      }

      toast.success("Účet smazán");
      navigate("/");
    } catch (error) {
      logger.error("Chyba při mazani uctu:", error);
      toast.error("Chyba při mazání účtu");
    }
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profil</h1>
          <p className="text-muted-foreground">správuj svůj účet a data</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informace o účtu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Účet vytvořen</Label>
                <span className="text-sm text-muted-foreground">
                  {user?.created_at &&
                    new Date(user.created_at).toLocaleDateString("cs-CZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tvoje statistiky</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {progress?.total_points || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Celkem bodů</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {sessions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Aktivit</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {progress?.completed_mountains?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Zdolaných hor</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {Math.floor(
                      sessions.reduce((acc, s) => acc + s.duration, 0) / 3600
                    )}
                    h
                  </div>
                  <div className="text-sm text-muted-foreground">Celkem hodin</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export dat</CardTitle>
              <CardDescription>
                Stáhni si svá data ve formátu JSON nebo CSV
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={exportData} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportovat jako JSON
              </Button>
              <Button onClick={exportCSV} className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportovat jako CSV
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">Smazání účtu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Pokud smažeš účet, přijdeš o všechna data. Tuto akci nelze vrátit zpět!
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Smazat účet
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Fakt to chceš smazat?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Všechny tvoje body, hory a aktivity budou pryč. Nejde to vrátit!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Ne, nechat to</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Ano, smazat
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;






