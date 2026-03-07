import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export type FriendshipStatus = "pending" | "accepted" | "rejected";

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export interface Friend {
  friend_id: string;
  username: string | null;
  email: string | null;
  total_points: number;
  created_at: string;
}

export interface FriendRequest {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  created_at: string;
}

export interface UserSearchResult {
  id: string;
  username: string | null;
  email: string | null;
  total_points: number;
}

export const useFriends = (userId: string | undefined) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFriends = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase.rpc("get_friends_list", { target_user_id: userId });
    if (error) {
      logger.error("Chyba při načítání přátel:", error);
      return;
    }

    setFriends(data || []);
  }, [userId]);

  const loadPendingRequests = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase.rpc("get_pending_requests", { target_user_id: userId });
    if (error) {
      logger.error("Chyba při načítání žádostí:", error);
      return;
    }

    setPendingRequests(data || []);
  }, [userId]);

  const loadSentRequests = useCallback(async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("friendships")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending");

    if (error) {
      logger.error("Chyba při načítání odeslaných žádostí:", error);
      return;
    }

    setSentRequests(
      (data || []).map((d) => ({
        ...d,
        status: d.status as FriendshipStatus,
      }))
    );
  }, [userId]);

  const loadAll = useCallback(async () => {
    await Promise.all([loadFriends(), loadPendingRequests(), loadSentRequests()]);
  }, [loadFriends, loadPendingRequests, loadSentRequests]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    loadAll().finally(() => setLoading(false));
  }, [userId, loadAll]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("friendships-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships", filter: `user_id=eq.${userId}` }, loadAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships", filter: `friend_id=eq.${userId}` }, loadAll)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadAll]);

  const sendFriendRequest = async (friendId: string) => {
    if (!userId) throw new Error("Nejsi přihlášený.");

    const { data: existing } = await supabase
      .from("friendships")
      .select("*")
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

    if (existing && existing.length > 0) {
      throw new Error("Žádost už existuje.");
    }

    const { error } = await supabase.from("friendships").insert({
      user_id: userId,
      friend_id: friendId,
      status: "pending",
    });

    if (error) throw error;
    await loadSentRequests();
  };

  const acceptFriendRequest = async (requestId: string) => {
    const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("id", requestId);
    if (error) throw error;
    await loadAll();
  };

  const rejectFriendRequest = async (requestId: string) => {
    const { error } = await supabase.from("friendships").update({ status: "rejected" }).eq("id", requestId);
    if (error) throw error;
    await loadPendingRequests();
  };

  const cancelFriendRequest = async (requestId: string) => {
    const { error } = await supabase.from("friendships").delete().eq("id", requestId);
    if (error) throw error;
    await loadSentRequests();
  };

  const removeFriend = async (friendId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("friendships")
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .eq("status", "accepted");

    if (error) throw error;
    await loadFriends();
  };

  const searchUsers = async (query: string): Promise<UserSearchResult[]> => {
    if (!query || query.length < 2) return [];

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username, email")
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
      .neq("id", userId || "")
      .limit(10);

    if (profilesError || !profiles || profiles.length === 0) return [];

    const profileIds = profiles.map((p) => p.id);
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("user_id, total_points")
      .in("user_id", profileIds);

    return profiles.map((profile) => {
      const p = progressData?.find((x) => x.user_id === profile.id);
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        total_points: p?.total_points || 0,
      };
    });
  };

  return {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    removeFriend,
    searchUsers,
    refresh: loadAll,
  };
};
