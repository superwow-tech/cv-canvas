import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface Subscription {
  plan: string;
  subscribed: boolean;
  currentPeriodEnd: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  subscription: Subscription;
  isPro: boolean;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const freePlan: Subscription = { plan: "free", subscribed: false, currentPeriodEnd: null };

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  subscription: freePlan,
  isPro: false,
  refreshSubscription: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription>(freePlan);

  const loadSubscription = async (userId: string) => {
    const { data } = await supabase
      .from("subscribers")
      .select("plan, subscribed, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    setSubscription(
      data
        ? {
            plan: data.plan ?? "free",
            subscribed: Boolean(data.subscribed),
            currentPeriodEnd: data.current_period_end ?? null,
          }
        : freePlan
    );
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
      if (next?.user) {
        // Defer the DB read so we never block the auth callback.
        setTimeout(() => void loadSubscription(next.user.id), 0);
      } else {
        setSubscription(freePlan);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) void loadSubscription(data.session.user.id);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    subscription,
    isPro: subscription.subscribed,
    refreshSubscription: async () => {
      if (session?.user) await loadSubscription(session.user.id);
    },
    signOut: async () => {
      await supabase.auth.signOut();
      setSession(null);
      setSubscription(freePlan);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
