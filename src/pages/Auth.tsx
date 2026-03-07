import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mountain } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const forceLogout = searchParams.get("logout") === "1";
  const [logoutInProgress, setLogoutInProgress] = useState(forceLogout);

  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  useEffect(() => {
    if (!forceLogout) {
      setLogoutInProgress(false);
      return;
    }

    const runForcedLogout = async () => {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } finally {
        setLogoutInProgress(false);
      }
    };

    void runForcedLogout();
  }, [forceLogout]);

  useEffect(() => {
    if (!logoutInProgress && user) navigate("/dashboard");
  }, [logoutInProgress, user, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      toast.error("Vyplň e-mail i heslo.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Přihlášení se nepovedlo.", { description: error.message });
    } else {
      toast.success("Jsi přihlášený.");
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (!email || !password || !confirmPassword) {
      toast.error("Vyplň všechna pole.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Heslo musí mít aspoň 8 znaků.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Hesla se neshodují.");
      setLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/dashboard`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) {
      toast.error("Registrace se nepovedla.", { description: error.message });
    } else {
      if (data.session) {
        toast.success("Účet je vytvořený a jsi přihlášený.");
        navigate("/dashboard");
      } else {
        toast.success("Účet je vytvořený.");
        toast.message("Zkontroluj e-mail a potvrď registraci.");
        navigate("/auth");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Mountain className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ClimbFlow
            </span>
          </div>
          <CardTitle>Vítej zpět</CardTitle>
          <CardDescription>Přihlas se nebo si vytvoř účet.</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Přihlášení</TabsTrigger>
              <TabsTrigger value="signup">Registrace</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input id="login-email" name="email" type="email" placeholder="tvuj@email.cz" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Heslo</Label>
                  <Input id="login-password" name="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Přihlašuji..." : "Přihlásit se"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">E-mail</Label>
                  <Input id="signup-email" name="email" type="email" placeholder="tvuj@email.cz" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Heslo</Label>
                  <Input id="signup-password" name="password" type="password" placeholder="••••••••" required minLength={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Potvrzení hesla</Label>
                  <Input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Vytvářím účet..." : "Vytvořit účet"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
