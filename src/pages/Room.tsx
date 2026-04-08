import { useState } from "react";
import Navbar from "@/components/Navbar";
import RoomSidebar from "@/components/RoomSidebar";
import Editor, { DEFAULT_CODE } from "@/components/Editor";
import AIReviewPanel from "@/components/AIReviewPanel";
import ChatPanel from "@/components/ChatPanel";
import { Bot, MessageSquare } from "lucide-react";

type Tab = "ai" | "chat";

export default function Room() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<Tab>("ai");

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <div className="flex-1 flex min-h-0">
        <RoomSidebar />

        <Editor
          code={code}
          language={language}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
        />

        {/* Right Panel */}
        <div className="w-80 border-l border-border flex flex-col bg-card shrink-0">
          <div className="flex border-b border-border shrink-0">
            {[
              { key: "ai" as Tab, icon: Bot, label: "AI Review" },
              { key: "chat" as Tab, icon: MessageSquare, label: "Chat" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 ${
                  activeTab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            {activeTab === "ai" ? (
              <AIReviewPanel code={code} language={language} />
            ) : (
              <ChatPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
