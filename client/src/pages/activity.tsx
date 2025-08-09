import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { ActivityItem } from "@/components/activity-item";

export default function Activity() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: recentExpenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ["/api/expenses/recent"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
        <div>
          <h1 className="text-2xl font-bold">Activity</h1>
          <p className="text-white/80 text-sm">Your recent transactions</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {expensesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentExpenses.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300 mt-8">
            <CardContent className="p-8 text-center">
              <i className="fas fa-receipt text-6xl text-gray-400 mb-6"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No activity yet</h3>
              <p className="text-gray-500">
                Your recent expenses and transactions will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Expenses ({recentExpenses.length})
              </h2>
            </div>
            
            <div className="space-y-3">
              {recentExpenses.map((expense: any) => (
                <ActivityItem key={expense.id} expense={expense} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
