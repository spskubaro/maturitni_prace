import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, UserPlus, Clock } from "lucide-react";
import { FriendRequest } from "@/hooks/useFriends";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";

interface FriendRequestsCardProps {
  pendingRequests: FriendRequest[];
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export const FriendRequestsCard = ({
  pendingRequests,
  onAccept,
  onReject,
}: FriendRequestsCardProps) => {
  const getInitials = (email: string | null, username: string | null) => {
    if (username) return username.slice(0, 2).toUpperCase();
    if (email) return email.slice(0, 2).toUpperCase();
    return "??";
  };

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Žádosti o přátelství
          {pendingRequests.length > 0 && (
            <Badge variant="default" className="ml-auto">
              {pendingRequests.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(request.email, request.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {request.username || request.email || "Neznámý uživatel"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(request.created_at), {
                        addSuffix: true,
                        locale: cs,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onAccept(request.id)}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(request.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

