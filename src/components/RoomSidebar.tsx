import { useParams } from "react-router-dom";
import { getMockUsers } from "@/lib/mock-api";
import { Hash, Users, Copy, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Notification {
  id: string;
  text: string;
}

interface RoomSidebarProps {
  onClose?: () => void;
}

export default function RoomSidebar({ onClose }: RoomSidebarProps) {
  const { id } = useParams();
  const users = getMockUsers();
  const [copied, setCopied] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(id || "default");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNotifications([{ id: "1", text: "Alice joined the room" }]);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <aside className="w-56 h-full bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 overflow-hidden">
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Room</div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-0.5 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="p-3 border-b border-sidebar-border">
        <button onClick={copyRoomId} className="flex items-center gap-2 w-full bg-sidebar-accent rounded-md px-2.5 py-1.5 hover:bg-muted transition-colors group">
          <Hash className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm text-foreground truncate flex-1 text-left font-mono">{id || "default"}</span>
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
      </div>

      <div className="p-3 flex-1 overflow-y-auto">
        <div className="flex items-center gap-1.5 mb-3">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Users ({users.filter(u => u.online).length})</span>
        </div>
        <ul className="space-y-1">
          {users.map(u => (
            <li key={u.id} className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm">
              <span className={`h-2 w-2 rounded-full shrink-0 ${u.online ? "bg-online" : "bg-muted-foreground/40"}`} />
              <span className={u.online ? "text-foreground" : "text-muted-foreground"}>{u.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-sidebar-border">
          {notifications.map(n => (
            <div key={n.id} className="text-xs text-accent animate-fade-in">{n.text}</div>
          ))}
        </div>
      )}
    </aside>
  );
}
