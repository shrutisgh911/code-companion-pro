import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";
import { X, Plus, FileCode2 } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "typescript", label: "TypeScript" },
];

const DEFAULT_CODE = `// Welcome to CodeCollab!
// Start coding here — changes sync in real-time.

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
`;

export interface FileTab {
  id: string;
  name: string;
  language: string;
  code: string;
}

const DEFAULT_TABS: FileTab[] = [
  { id: "1", name: "index.js", language: "javascript", code: DEFAULT_CODE },
];

let nextId = 2;

interface EditorProps {
  code: string;
  language: string;
  onCodeChange: (val: string) => void;
  onLanguageChange: (lang: string) => void;
}

export default function Editor({ code, language, onCodeChange, onLanguageChange }: EditorProps) {
  const [tabs, setTabs] = useState<FileTab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState("1");

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const switchTab = (tab: FileTab) => {
    // Save current code to current tab before switching
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, code, language } : t));
    setActiveTabId(tab.id);
    onCodeChange(tab.code);
    onLanguageChange(tab.language);
  };

  const addTab = () => {
    // Save current state first
    setTabs(prev => {
      const updated = prev.map(t => t.id === activeTabId ? { ...t, code, language } : t);
      const id = String(nextId++);
      const newTab: FileTab = { id, name: `untitled-${id}.js`, language: "javascript", code: "// New file\n" };
      setActiveTabId(id);
      onCodeChange(newTab.code);
      onLanguageChange(newTab.language);
      return [...updated, newTab];
    });
  };

  const closeTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    setTabs(prev => {
      const filtered = prev.filter(t => t.id !== tabId);
      if (tabId === activeTabId) {
        const fallback = filtered[0];
        setActiveTabId(fallback.id);
        onCodeChange(fallback.code);
        onLanguageChange(fallback.language);
      }
      return filtered;
    });
  };

  const handleLanguageChange = (lang: string) => {
    onLanguageChange(lang);
    // Update tab name extension
    const ext = lang === "javascript" ? "js" : lang === "typescript" ? "ts" : lang === "python" ? "py" : lang === "cpp" ? "cpp" : "java";
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, language: lang, name: t.name.replace(/\.[^.]+$/, `.${ext}`) } : t));
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* File Tabs */}
      <div className="h-9 bg-card border-b border-border flex items-center shrink-0 overflow-x-auto scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab)}
            className={`group flex items-center gap-1.5 px-3 h-full text-xs border-r border-border shrink-0 transition-colors ${
              tab.id === activeTabId
                ? "bg-background text-foreground border-b-2 border-b-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="truncate max-w-[100px]">{tab.name}</span>
            {tabs.length > 1 && (
              <span
                onClick={(e) => closeTab(e, tab.id)}
                className="ml-1 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity"
              >
                <X className="h-3 w-3" />
              </span>
            )}
          </button>
        ))}
        <button
          onClick={addTab}
          className="h-full px-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          title="New file"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="h-9 bg-card border-b border-border flex items-center px-3 gap-2 shrink-0">
        <select
          value={language}
          onChange={e => handleLanguageChange(e.target.value)}
          className="bg-input border border-border rounded px-2 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {LANGUAGES.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-online animate-pulse-dot" />
          <span>2 editors active</span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
          onChange={val => onCodeChange(val || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
            lineNumbers: "on",
            renderLineHighlight: "all",
            bracketPairColorization: { enabled: true },
            cursorBlinking: "smooth",
            smoothScrolling: true,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}

export { DEFAULT_CODE };
