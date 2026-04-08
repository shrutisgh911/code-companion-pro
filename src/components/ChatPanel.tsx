import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { sendMessage, ChatMessage } from "@/lib/mock-api";
import { Send } from "lucide-react";

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "1", userId: "user-2", username: "Alice", text: "Hey! Working on the auth module 👋", timestamp: Date.now() - 120000 },
  { id: "2", userId: "user-3", username: "Bob", text: "Nice, I'll handle the API routes", timestamp: Date.now() - 60000 },
];

export default function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock incoming typing indicator
  useEffect(() => {
    const t1 = setTimeout(() => setTyping(true), 5000);
    const t2 = setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: "auto-" + Date.now(),
        userId: "user-2",
        username: "Alice",
        text: "Just pushed a fix for the login flow",
        timestamp: Date.now(),
      }]);
    }, 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const msg = await sendMessage("room", input.trim(), user);
    setMessages(prev => [...prev, msg]);
    setInput("");
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(m => {
          const isMe = m.userId === user?.id;
          return (
            <div key={m.id} className={`animate-fade-in ${isMe ? "text-right" : ""}`}>
              <div className={`inline-block max-w-[85%] text-left ${isMe ? "bg-primary/20 border-primary/30" : "bg-secondary"} rounded-lg px-3 py-2 border border-border`}>
                {!isMe && <div className="text-xs font-medium text-primary mb-0.5">{m.username}</div>}
                <p className="text-sm text-foreground">{m.text}</p>
                <div className="text-[10px] text-muted-foreground mt-1">{formatTime(m.timestamp)}</div>
              </div>
            </div>
          );
        })}

        {typing && (
          <div className="text-xs text-muted-foreground flex items-center gap-1 animate-fade-in">
            <span className="font-medium">Alice</span> is typing
            <span className="flex gap-0.5">
              <span className="h-1 w-1 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0ms" }} />
              <span className="h-1 w-1 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "200ms" }} />
              <span className="h-1 w-1 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "400ms" }} />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-primary text-primary-foreground rounded-md px-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
