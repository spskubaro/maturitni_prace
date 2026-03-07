import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useFriends } from "@/hooks/useFriends";
import { FriendsList } from "@/components/friends/FriendsList";
import { FriendRequestsCard } from "@/components/friends/FriendRequestsCard";
import { UserSearch } from "@/components/friends/UserSearch";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Friends = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    friends,
    pendingRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    searchUsers,
  } = useFriends(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSendRequest = async (friendId: string) => {
    try {
      await sendFriendRequest(friendId);
      toast.success("Žádost o přátelství odeslána!");
    } catch (error: unknown) {
      logger.error("Chyba při odesilani žádosti:", error);
      const errorMessage = error instanceof Error ? error.message : "Chyba při odesílání žádosti";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Žádost přijata!");
    } catch (error) {
      logger.error("Chyba při přijimani žádosti:", error);
      toast.error("Chyba při přijímání žádosti");
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      toast.success("Žádost odmítnuta");
    } catch (error) {
      logger.error("Chyba při odmítání žádosti:", error);
      toast.error("Chyba při odmítání žádosti");
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriend(friendId);
      toast.success("Přítel odebrán");
    } catch (error) {
      logger.error("Chyba při odebirani přitele:", error);
      toast.error("Chyba při odebírání přítele");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8" />
            Přátelé
          </h1>
          <p className="text-muted-foreground mt-2">
            Najdi přátele a sdílej s nimi svoje výsledky
          </p>
        </div>

        <Tabs defaultValue="friends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">
              Moji přátelé ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="search">
              Najít přátele
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-6">
            <FriendRequestsCard
              pendingRequests={pendingRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />

            <FriendsList friends={friends} onRemoveFriend={handleRemoveFriend} />

            {sentRequests.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-2 text-sm text-muted-foreground">
                  Odeslané žádosti ({sentRequests.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Čekáš na odpověď od {sentRequests.length}{" "}
                  {sentRequests.length === 1 ? "uživatele" : "uživatelů"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <UserSearch
              friends={friends}
              sentRequests={sentRequests}
              onSearch={searchUsers}
              onSendRequest={handleSendRequest}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Friends;



