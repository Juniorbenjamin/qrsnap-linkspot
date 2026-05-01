import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getPaddleEnvironment } from "@/lib/paddle";
import { useAuth } from "@/lib/store";

export type SubscriptionRow = {
  id: string;
  paddle_subscription_id: string;
  paddle_customer_id: string;
  product_id: string;
  price_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  environment: "sandbox" | "live";
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const env = getPaddleEnvironment();

  const refresh = async (uid: string) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", uid)
      .eq("environment", env)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription((data as SubscriptionRow | null) ?? null);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) { setSubscription(null); setLoading(false); return; }
    setLoading(true);
    refresh(user.id);

    const channel = supabase
      .channel(`subs-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` },
        () => refresh(user.id)
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const now = new Date();
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end) : null;
  const inPeriod = !periodEnd || periodEnd > now;

  const isActive = !!subscription && (
    (["active", "trialing", "past_due"].includes(subscription.status) && inPeriod) ||
    (subscription.status === "canceled" && periodEnd != null && periodEnd > now)
  );

  return {
    subscription,
    loading,
    isActive,
    isPastDue: subscription?.status === "past_due",
    cancelAtPeriodEnd: subscription?.cancel_at_period_end ?? false,
    refresh: () => user && refresh(user.id),
  };
}
