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
    const result = supabase.auth.onAuthStateChange((_event, sessionValue) => {
      setSession(sessionValue);
      setUser(sessionValue?.user ?? null);
      setLoading(false);
    });
    const authSubscription = result.data.subscription;

    supabase.auth.getSession().then((resultValue) => {
      const currentSession = resultValue.data.session;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    let signOutErrorMessage: string | null = null;

    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) {
        signOutErrorMessage = error.message;
        logger.warn("Lokální odhlášení vrátilo chybu:", error);
      }
    } catch (error) {
      signOutErrorMessage = error instanceof Error ? error.message : "Neznámá chyba";
      logger.warn("Odhlášení vyhodilo výjimku:", error);
    } finally {
      // I při chybě odhlášení nechceme blokovat uživatele v UI.
      setSession(null);
      setUser(null);
      navigate("/");
    }

    if (signOutErrorMessage) {
      toast.message("Byl jsi odhlášen v této aplikaci.", {
        description: "Pokud by přihlášení zůstalo, obnov stránku.",
      });
    }
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
