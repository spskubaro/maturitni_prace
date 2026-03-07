import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserMinus, Trophy, Mountain } from "lucide-react";
import { Friend } from "@/hooks/useFriends";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FriendsListProps {
  friends: Friend[];
  onRemoveFriend: (friendId: string) => Promise<void>;
}

export const FriendsList = ({ friends, onRemoveFriend }: FriendsListProps) => {
  const getInitials = (email: string | null, username: string | null) => {
    if (username) return username.slice(0, 2).toUpperCase();
    if (email) return email.slice(0, 2).toUpperCase();
    return "??";
  };

  if (friends.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <Mountain className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Zatím nemáš žádné přátele.</p>
          <p className="text-sm mt-1">Vyhledej uživatele a pošli jim žádost o přátelství!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="w-5 h-5" />
          Přátelé ({friends.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {friends.map((friend) => (
            <div
              key={friend.friend_id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(friend.email, friend.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {friend.username || friend.email || "Neznámý uživatel"}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Trophy className="w-3 h-3" />
                    <span>{friend.total_points.toLocaleString()} bodů</span>
                  </div>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Odstranit přítele?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Opravdu chceš odstranit {friend.username || friend.email} ze svých přátel?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Zrušit</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemoveFriend(friend.friend_id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Odstranit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

