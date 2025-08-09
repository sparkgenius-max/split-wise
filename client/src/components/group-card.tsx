import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    members: Array<{
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      profileImageUrl?: string;
    }>;
    memberCount: number;
    userBalance: number;
  };
}

export function GroupCard({ group }: GroupCardProps) {
  const formatBalance = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const getBalanceColor = (amount: number) => {
    return amount >= 0 ? "text-success" : "text-danger";
  };

  const getBalanceText = (amount: number) => {
    return amount >= 0 ? "you're owed" : "you owe";
  };

  const getGroupEmoji = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("trip") || lower.includes("travel")) return "🏖️";
    if (lower.includes("apartment") || lower.includes("room")) return "🏠";
    if (lower.includes("food") || lower.includes("dinner")) return "🍕";
    return "👥";
  };

  const getUserName = (user: any) => {
    return user.firstName || user.username || "User";
  };

  const displayedMembers = group.members.slice(0, 3);
  const extraMembersCount = Math.max(0, group.memberCount - 3);

  return (
    <Card className="bg-white border border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Group members avatars */}
            <div className="flex -space-x-2">
              {displayedMembers.map((member) => (
                <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={member.profileImageUrl || ""} alt={getUserName(member)} />
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {getUserName(member).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {extraMembersCount > 0 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{extraMembersCount}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                {getGroupEmoji(group.name)} {group.name}
              </h4>
              <p className="text-sm text-gray-500">{group.memberCount} members</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${getBalanceColor(group.userBalance)}`}>
              {formatBalance(group.userBalance)}
            </p>
            <p className="text-xs text-gray-400">{getBalanceText(group.userBalance)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
              Active
            </span>
          </div>
          <Button
            variant="ghost"
            className={`text-sm font-medium p-0 ${
              group.userBalance < 0 ? "text-danger hover:text-danger/80" : "text-primary hover:text-primary/80"
            }`}
          >
            {group.userBalance < 0 ? "Settle Up" : "View Details"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
