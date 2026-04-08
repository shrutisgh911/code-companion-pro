import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Code2, LogOut, Wifi, WifiOff, Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnected(prev => Math.random() > 0.05 ? true : !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-12 bg-card border-b border-border flex items-center justify-between px-3 sm:px-4 shrink-0">
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Code2 className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground text-sm">CodeCollab</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          {connected ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="text-destructive">Disconnected</span>
            </>
          )}
        </div>

        {/* Mobile: just the icon */}
        <div className="sm:hidden">
          {connected ? (
            <Wifi className="h-3.5 w-3.5 text-success" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-destructive" />
          )}
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-foreground hidden sm:block">{user?.name}</span>
        </div>

        <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
