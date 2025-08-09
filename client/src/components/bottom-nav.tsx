import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function BottomNav() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Home" },
    { path: "/groups", icon: "fas fa-users", label: "Groups" },
    { path: "/activity", icon: "fas fa-list", label: "Activity" },
    { path: "/profile", icon: "fas fa-user", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-2 h-auto ${
              location === item.path
                ? "text-primary"
                : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={() => setLocation(item.path)}
          >
            <i className={`${item.icon} text-xl`}></i>
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
