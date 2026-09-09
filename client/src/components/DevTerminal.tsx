import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { toast } from "sonner";
import AntigravityCanvas from "./AntigravityCanvas";

interface CommandTab {
  id: string;
  name: string;
  category: string;
  prompt: string;
  command: string;
  output: string[];
  status: string;
}

const TABS: CommandTab[] = [
  {
    id: "pos",
    name: "smart-pos",
    category: "Web & POS",
    prompt: "sabareesh@studio:~/smart-pos-portfolio-demo$",
    command: "pnpm run dev --host",
    output: [
      "  VITE v5.4.10 ready in 340 ms",
      "  ➜ Local:   http://localhost:5173/",
      "  ➜ Network: http://192.168.1.4:5173/",
      "  [POS Core] Dual-display customer sync: ACTIVE",
      "  [Scanner] Barcode & QR engine: READY (240 FPS)",
      "  [Analytics] Sales dashboard, bill-counter & receipt printer: ONLINE",
    ],
    status: "READY 0 errors",
  },
  {
    id: "fittrack",
    name: "fittrack-android",
    category: "Android / Kotlin",
    prompt: "sabareesh@studio:~/FitTrackApp$",
    command: "./gradlew assembleDebug && adb install -r app-debug.apk",
    output: [
      "> Task :app:compileDebugKotlin",
      "> Task :app:mergeDebugResources",
      "BUILD SUCCESSFUL in 4s",
      "Performing Streamed Install: Success",
      "Starting: Intent { act=android.intent.action.MAIN cmp=com.sabareesh.fittrack/.MainActivity }",
      "✓ Step Counter, Workout Timer & Calorie Tracker: SYNCED (Offline SQLite)",
    ],
    status: "DEVICE CONNECTED",
  },
  {
    id: "yolo",
    name: "yolo-vision",
    category: "AI & CV",
    prompt: "sabareesh@studio:~/yolo-object-tracking$",
    command: "python tracking_pipeline.py --model yolov8n.pt --source 0",
    output: [
      "Loading weights from yolov8n.pt... Done (3.2M params)",
      "OpenCV VideoCapture(0) initialized: 1920x1080 @ 60 FPS",
      "Tracking: [ID: 01 person 0.94] [ID: 02 laptop 0.89] [ID: 03 phone 0.92]",
      "Inference speed: 8.4ms preprocess, 14.1ms inference, 1.2ms postprocess",
      "Real-time visual tracking active.",
    ],
    status: "INFERENCE 60 FPS",
  },
  {
    id: "chatbot",
    name: "faq-chatbot",
    category: "NLP & AI",
    prompt: "sabareesh@studio:~/ai-faq-engine$",
    command: "python chatbot_server.py --vectorizer tfidf",
    output: [
      "[NLP Engine] Preprocessing text corpus with NLTK tokenizer...",
      "[TF-IDF] Fit vocabulary matrix: 450 intents, 1,280 features",
      "[Cosine Similarity] Query evaluator initialized",
      "Ready for input: 'How do I track calories offline?'",
      "Match found (confidence: 97.8%): 'FitTrack stores daily metrics locally...'",
    ],
    status: "NLP MATCH 97.8%",
  },
];

export default function DevTerminal() {
  const [activeTab, setActiveTab] = useState<string>("pos");
  const [copied, setCopied] = useState(false);

  const current = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.command);
    setCopied(true);
    toast.success("Command copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dev-terminal" data-cursor="Terminal ⌘">
      <AntigravityCanvas mode="dark-gold" />
      {/* Terminal Window Chrome */}
      <div className="terminal-header">
        <div className="terminal-controls">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <Terminal size={14} className="terminal-icon" />
          <span>sabareesh@portfolio: ~/{current.name}</span>
        </div>
        <div className="terminal-status-badge">
          <span className="pulse-dot" />
          <span>{current.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="terminal-tabs" role="tablist" aria-label="Project code tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`terminal-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            data-cursor="Select Tab"
          >
            <span className="tab-name">{tab.name}</span>
            <span className="tab-cat">{tab.category}</span>
          </button>
        ))}
      </div>

      {/* Terminal Body */}
      <div className="terminal-body">
        <div className="terminal-prompt-row">
          <span className="terminal-prompt">{current.prompt}</span>
          <span className="terminal-command">{current.command}</span>
          <button
            className="terminal-copy-btn"
            onClick={handleCopy}
            title="Copy command"
            aria-label="Copy terminal command"
            data-cursor="Copy Command"
          >
            {copied ? <Check size={14} className="text-mint" /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        <div className="terminal-output">
          {current.output.map((line, idx) => (
            <div key={idx} className="terminal-line">
              <span className="line-prefix">›</span>
              <span className="line-content">{line}</span>
            </div>
          ))}
          <div className="terminal-cursor-line">
            <span className="line-prefix">›</span>
            <span className="blinking-caret">▌</span>
          </div>
        </div>
      </div>
    </div>
  );
}
