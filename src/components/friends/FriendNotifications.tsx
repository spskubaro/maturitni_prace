import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { UserPlus } from "lucide-react";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: string;
  created_at: string;
}

export const FriendNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('friend-notifications')
      .on<Friendship>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'friendships',
          filter: `friend_id=eq.${user.id}` // Pouze když jsem přijemce zadosti
        },
        async (payload: RealtimePostgresChangesPayload<Friendship>) => {
          logger.debug('New friend request received:', payload);
          
          if (!payload.new || typeof payload.new !== 'object') return;
          const newRecord = payload.new as Friendship;
          
          if (newRecord.status === 'pending') {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('username, email')
              .eq('id', newRecord.user_id)
              .single();

            const senderName = senderProfile?.username || senderProfile?.email || 'Někdo';

            toast.info(`${senderName} ti poslal žádost o přátelství`, {
              icon: <UserPlus className="w-4 h-4" />,
              duration: 5000,
            });
          }
        }
      )
      .on<Friendship>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'friendships',
          filter: `user_id=eq.${user.id}` // Notifikace když mi Někdo přiji zadost
        },
        async (payload: RealtimePostgresChangesPayload<Friendship>) => {
          if (!payload.old || !payload.new || typeof payload.new !== 'object') return;
          const oldRecord = payload.old as Partial<Friendship>;
          const newRecord = payload.new as Friendship;
          
          if (oldRecord?.status === 'pending' && newRecord.status === 'accepted') {
            const { data: friendProfile } = await supabase
              .from('profiles')
              .select('username, email')
              .eq('id', newRecord.friend_id)
              .single();

            const friendName = friendProfile?.username || friendProfile?.email || 'Někdo';

            toast.success(`${friendName} přijal tvou žádost o přátelství!`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return null;
};

