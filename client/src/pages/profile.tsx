import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
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
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !user) {
    return (
      <div className="max-w-sm mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const userName = user.firstName || user.username || "User";
  const userHandle = user.username ? `@${user.username}` : "@user";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || userName;

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-white/80 text-sm">Manage your account</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
            onClick={() => window.location.href = '/api/logout'}
          >
            <i className="fas fa-sign-out-alt"></i>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.profileImageUrl || ""} alt={userName} />
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
                <p className="text-gray-600">{userHandle}</p>
                {user.email && (
                  <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="text-gray-800">{fullName}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-gray-600">Username</label>
              <p className="text-gray-800">{userHandle}</p>
            </div>
            
            {user.email && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </>
            )}
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-gray-600">Member Since</label>
              <p className="text-gray-800">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <i className="fas fa-bell text-gray-500"></i>
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Manage your notification preferences</p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <i className="fas fa-credit-card text-gray-500"></i>
                <div>
                  <p className="font-medium">Payment Methods</p>
                  <p className="text-sm text-gray-500">Manage your payment options</p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <i className="fas fa-shield-alt text-gray-500"></i>
                <div>
                  <p className="font-medium">Privacy & Security</p>
                  <p className="text-sm text-gray-500">Control your privacy settings</p>
                </div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-left p-4 h-auto"
            >
              <div className="flex items-center space-x-3">
                <i className="fas fa-question-circle text-gray-500"></i>
                <div>
                  <p className="font-medium">Help & Support</p>
                  <p className="text-sm text-gray-500">Get help or contact support</p>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Card className="border-danger/20">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full text-danger hover:bg-danger/10 hover:text-danger"
              onClick={() => window.location.href = '/api/logout'}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
