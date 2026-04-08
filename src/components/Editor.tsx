import MonacoEditor from "@monaco-editor/react";
import { useState } from "react";

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

interface EditorProps {
  code: string;
  language: string;
  onCodeChange: (val: string) => void;
  onLanguageChange: (lang: string) => void;
}

export default function Editor({ code, language, onCodeChange, onLanguageChange }: EditorProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <div className="h-9 bg-card border-b border-border flex items-center px-3 gap-2 shrink-0">
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
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
