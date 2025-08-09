import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Groups from "@/pages/groups";
import Activity from "@/pages/activity";
import Profile from "@/pages/profile";
import { BottomNav } from "@/components/bottom-nav";

function Router({ isAuthenticated, isLoading }: { isAuthenticated: boolean; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/groups" component={Groups} />
          <Route path="/activity" component={Activity} />
          <Route path="/profile" component={Profile} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Router isAuthenticated={isAuthenticated} isLoading={isLoading} />
      {/* Bottom navigation will only show for authenticated users */}
      {isAuthenticated && <BottomNav />}
      <Toaster />
    </div>
  );
}

export default App;
