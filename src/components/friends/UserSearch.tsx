import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Trophy, Loader2, X } from "lucide-react";
import { UserSearchResult, Friendship } from "@/hooks/useFriends";
import { toast } from "sonner";

interface UserSearchProps {
  friends: { friend_id: string }[];
  sentRequests: Friendship[];
  onSearch: (query: string) => Promise<UserSearchResult[]>;
  onSendRequest: (friendId: string) => Promise<void>;
}

export const UserSearch = ({
  friends,
  sentRequests,
  onSearch,
  onSendRequest,
}: UserSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  const handleSearch = async () => {
    if (query.length < 2) {
      toast.error("Zadej alespoň 2 znaky");
      return;
    }

    setSearching(true);
    try {
      const searchResults = await onSearch(query);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast.info("Žádní uživatelé nenalezeni");
      }
    } catch (error) {
      toast.error("Chyba při vyhledávání");
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setSendingTo(userId);
    try {
      await onSendRequest(userId);
      toast.success("Žádost o přátelstvi odeslána!");
      
      setResults((prev) => prev.filter((r) => r.id !== userId));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Chyba při odesílání žádosti";
      toast.error(errorMessage);
    } finally {
      setSendingTo(null);
    }
  };

  const getInitials = (email: string | null, username: string | null) => {
    if (username) return username.slice(0, 2).toUpperCase();
    if (email) return email.slice(0, 2).toUpperCase();
    return "??";
  };

  const isAlreadyFriend = (userId: string) => {
    return friends.some((f) => f.friend_id === userId);
  };

  const hasRequestPending = (userId: string) => {
    return sentRequests.some((r) => r.friend_id === userId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Najít přátele
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Zadej username nebo email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((user) => {
              const isFriend = isAlreadyFriend(user.id);
              const isPending = hasRequestPending(user.id);

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(user.email, user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.username || user.email || "Neznámý uživatel"}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Trophy className="w-3 h-3" />
                        <span>{user.total_points.toLocaleString()} bodů</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isFriend ? (
                      <Button variant="secondary" size="sm" disabled>
                        Už je přítel
                      </Button>
                    ) : isPending ? (
                      <Button variant="secondary" size="sm" disabled>
                        Žádost odeslána
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSendRequest(user.id)}
                        disabled={sendingTo === user.id}
                      >
                        {sendingTo === user.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Přidat
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


