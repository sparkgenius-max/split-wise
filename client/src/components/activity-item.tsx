import { Card, CardContent } from "@/components/ui/card";

interface ActivityItemProps {
  expense: {
    id: string;
    title: string;
    amount: string;
    paidBy: {
      firstName?: string;
      username?: string;
    };
    group: {
      name: string;
    };
    userShare: number;
    createdAt: string;
  };
}

export function ActivityItem({ expense }: ActivityItemProps) {
  const formatBalance = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const getBalanceColor = (amount: number) => {
    return amount >= 0 ? "text-success" : "text-danger";
  };

  const getExpenseIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("dinner") || lower.includes("food") || lower.includes("restaurant")) {
      return "🍽️";
    }
    if (lower.includes("grocery") || lower.includes("groceries")) {
      return "🛒";
    }
    if (lower.includes("uber") || lower.includes("taxi") || lower.includes("ride")) {
      return "🚗";
    }
    if (lower.includes("gas") || lower.includes("fuel")) {
      return "⛽";
    }
    if (lower.includes("coffee") || lower.includes("cafe")) {
      return "☕";
    }
    return "💰";
  };

  const getPaidByName = (user: any) => {
    return user.firstName || user.username || "Someone";
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const expenseDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - expenseDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {/* Expense icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl">
            {getExpenseIcon(expense.title)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">{expense.title}</h4>
              <p className="font-semibold text-gray-800">${expense.amount}</p>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-500">
                <span>{getPaidByName(expense.paidBy)}</span> paid • 
                <span className="ml-1">{expense.group.name}</span>
              </p>
              <p className={`text-sm font-medium ${getBalanceColor(expense.userShare)}`}>
                {formatBalance(expense.userShare)}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(expense.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
