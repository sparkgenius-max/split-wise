import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GroupCard } from "@/components/group-card";
import { ActivityItem } from "@/components/activity-item";
import { ExpenseForm } from "@/components/expense-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      const timeoutId = setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      
      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: groups = [], isLoading: groupsLoading } = useQuery<any[]>({
    queryKey: ["/api/groups"],
    retry: false,
  });

  const { data: balance = { balance: 0 }, isLoading: balanceLoading } = useQuery<{ balance: number }>({
    queryKey: ["/api/balance"],
    retry: false,
  });

  const { data: recentExpenses = [], isLoading: expensesLoading } = useQuery<any[]>({
    queryKey: ["/api/expenses/recent"],
    retry: false,
  });

  if (isLoading || !user) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatBalance = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const getBalanceColor = (amount: number) => {
    return amount >= 0 ? "text-success" : "text-danger";
  };

  const userName = (user as any)?.firstName || (user as any)?.username || "User";
  const userHandle = (user as any)?.username ? `@${(user as any).username}` : "@user";

  return (
    <div className="max-w-sm mx-auto bg-gray-50 min-h-screen relative overflow-hidden pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary p-4 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white/30">
              <AvatarImage src={(user as any)?.profileImageUrl || ""} alt={userName} />
              <AvatarFallback className="bg-white/20 text-white">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-lg">{userName}</h1>
              <p className="text-sm text-white/80">{userHandle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <i className="fas fa-bell"></i>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
              onClick={() => window.location.href = '/api/logout'}
            >
              <i className="fas fa-sign-out-alt"></i>
            </Button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="mt-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-white/80 text-sm">Your Balance</p>
            <h2 className={`text-3xl font-bold text-white ${balanceLoading ? 'animate-pulse' : ''}`}>
              {balanceLoading ? "Loading..." : formatBalance(balance.balance)}
            </h2>
            <p className="text-white/60 text-xs mt-1">
              {balance.balance >= 0 ? "You're owed overall" : "You owe overall"}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="fixed bottom-28 right-6 z-20">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="w-14 h-14 bg-gradient-to-r from-accent to-orange-400 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-3 border-white/50"
            >
              <i className="fas fa-plus text-white text-xl drop-shadow-sm"></i>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto">
            <ExpenseForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Active Groups */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Active Groups</h3>
            <Button variant="ghost" className="text-primary text-sm font-medium p-0">
              See All
            </Button>
          </div>

          {groupsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : groups.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300 bg-white">
              <CardContent className="p-8 text-center">
                <i className="fas fa-users text-4xl text-gray-400 mb-4"></i>
                <h4 className="font-semibold text-gray-600 mb-2">No groups yet</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first group to start splitting expenses
                </p>
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Create Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {groups.slice(0, 2).map((group: any) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
            <Button variant="ghost" className="text-primary text-sm font-medium p-0">
              View All
            </Button>
          </div>

          {expensesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse bg-white shadow-sm">
                  <CardContent className="p-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentExpenses.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300 bg-white">
              <CardContent className="p-8 text-center">
                <i className="fas fa-receipt text-4xl text-gray-400 mb-4"></i>
                <h4 className="font-semibold text-gray-600 mb-2">No expenses yet</h4>
                <p className="text-sm text-gray-500">
                  Add your first expense to get started
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentExpenses.slice(0, 3).map((expense: any) => (
                <ActivityItem key={expense.id} expense={expense} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Stats */}
        <section className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            This Month
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary">$0</p>
              <p className="text-xs text-gray-600 mt-1">Total Spent</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-success">$0</p>
              <p className="text-xs text-gray-600 mt-1">Saved Splitting</p>
            </div>
          </div>
          <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Most spent on:</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg">🍕</span>
                <span className="font-medium text-gray-800">Food & Dining</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
