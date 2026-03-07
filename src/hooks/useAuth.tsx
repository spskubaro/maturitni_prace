import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | undefined;

    const setupAuth = () => {
      const result = supabase.auth.onAuthStateChange((_event, sessionValue) => {
        setSession(sessionValue);
        setUser(sessionValue?.user ?? null);
        setLoading(false);
      });

      authSubscription = result.data.subscription;
    };

    setupAuth();

    supabase.auth.getSession().then((result) => {
      const currentSession = result.data.session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // Lokální odhlášení je spolehlivější na mobilu i při slabém připojení.
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      logger.error("Chyba při odhlášení:", error);
      toast.error("Odhlášení se nepovedlo.", { description: error.message });
      return;
    }

    setSession(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Hook useAuth musí být použit uvnitř AuthProvideru.");
  }
  return context;
};
