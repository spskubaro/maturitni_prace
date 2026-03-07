import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

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
      const result = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);

        if (session && session.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }

        setLoading(false);
      });

      authSubscription = result.data.subscription;
    };

    setupAuth();

    supabase.auth.getSession().then((result) => {
      const currentSession = result.data.session;

      setSession(currentSession);
      if (currentSession && currentSession.user) {
        setUser(currentSession.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return <AuthContext.Provider value={{ user, session, loading, signOut }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Hook useAuth musí být použit uvnitř AuthProvideru.");
  }
  return context;
};
