import { useState } from "react";
import Navbar from "@/components/Navbar";
import RoomSidebar from "@/components/RoomSidebar";
import Editor, { DEFAULT_CODE } from "@/components/Editor";
import AIReviewPanel from "@/components/AIReviewPanel";
import ChatPanel from "@/components/ChatPanel";
import { Bot, MessageSquare, PanelRightOpen, PanelRightClose } from "lucide-react";

type Tab = "ai" | "chat";

export default function Room() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<Tab>("ai");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex-1 flex min-h-0 relative">
        {/* Sidebar - overlay on mobile, inline on desktop */}
        <div
          className={`
            absolute inset-y-0 left-0 z-30 transition-transform duration-200 ease-in-out
            lg:relative lg:translate-x-0 lg:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <RoomSidebar onClose={() => setSidebarOpen(false)} />
        </div>
        {/* Backdrop on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Editor */}
        <Editor
          code={code}
          language={language}
          onCodeChange={setCode}
          onLanguageChange={setLanguage}
        />

        {/* Right Panel toggle (mobile) */}
        <button
          onClick={() => setRightPanelOpen(prev => !prev)}
          className="lg:hidden absolute top-2 right-2 z-20 p-1.5 rounded-md bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          title="Toggle panel"
        >
          {rightPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
        </button>

        {/* Right Panel */}
        <div
          className={`
            absolute inset-y-0 right-0 z-30 w-80 border-l border-border flex flex-col bg-card shrink-0 transition-transform duration-200 ease-in-out
            lg:relative lg:translate-x-0 lg:z-auto
            ${rightPanelOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <div className="flex border-b border-border shrink-0">
            {([
              { key: "ai" as Tab, icon: Bot, label: "AI Review" },
              { key: "chat" as Tab, icon: MessageSquare, label: "Chat" },
            ]).map(t => (
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
        {/* Right panel backdrop on mobile */}
        {rightPanelOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setRightPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
