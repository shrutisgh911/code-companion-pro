import { useState } from "react";
import { reviewCodeAPI, AIReviewResult } from "@/lib/mock-api";
import { Bot, Loader2, Copy, Check, Trash2, Bug, Lightbulb, Shield, Sparkles } from "lucide-react";

interface Props {
  code: string;
  language: string;
}

export default function AIReviewPanel({ code, language }: Props) {
  const [result, setResult] = useState<AIReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    try {
      const res = await reviewCodeAPI(code, language);
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  const copyOptimized = () => {
    if (result?.optimizedCode) {
      navigator.clipboard.writeText(result.optimizedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sections = result ? [
    { icon: Bug, title: "Bugs", items: result.bugs, color: "text-destructive" },
    { icon: Lightbulb, title: "Improvements", items: result.improvements, color: "text-warning" },
    { icon: Shield, title: "Security Issues", items: result.securityIssues, color: "text-primary" },
  ] : [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <button
          onClick={handleReview}
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
          {loading ? "Reviewing..." : "Review Code"}
        </button>
        {result && (
          <button onClick={() => setResult(null)} className="text-muted-foreground hover:text-foreground p-2" title="Clear">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {!result && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm text-center gap-2">
            <Bot className="h-8 w-8 opacity-40" />
            <p>Click "Review Code" to get AI-powered analysis</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm">Analyzing your code...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-fade-in">
            {sections.map(s => (
              <div key={s.title}>
                <div className={`flex items-center gap-1.5 mb-2 text-sm font-medium ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                  {s.title} ({s.items.length})
                </div>
                <ul className="space-y-1.5">
                  {s.items.map((item, i) => (
                    <li key={i} className="text-xs text-secondary-foreground bg-secondary rounded-md px-3 py-2">{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-sm font-medium text-accent">
                  <Sparkles className="h-4 w-4" />
                  Optimized Code
                </div>
                <button onClick={copyOptimized} className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-xs bg-secondary rounded-md p-3 overflow-x-auto font-mono text-secondary-foreground whitespace-pre-wrap">
                {result.optimizedCode}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
