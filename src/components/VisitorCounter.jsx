import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const BASE_COUNT = 1000;
const STORAGE_KEY = "site_visitor_count";
const SESSION_KEY = "site_visitor_session";

export default function VisitorCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    // Get or init stored count
    let stored = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    if (!stored || stored < BASE_COUNT) stored = BASE_COUNT + Math.floor(Math.random() * 200);

    // Only increment once per session
    const hasSession = sessionStorage.getItem(SESSION_KEY);
    if (!hasSession) {
      stored += 1;
      sessionStorage.setItem(SESSION_KEY, "1");
    }

    localStorage.setItem(STORAGE_KEY, String(stored));
    setCount(stored);

    // Slow organic increment simulation
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + 1;
        localStorage.setItem(STORAGE_KEY, String(next));
        return next;
      });
    }, 45000); // +1 every 45 seconds

    return () => clearInterval(timer);
  }, []);

  if (count === null) return null;

  return (
    <div className="fixed bottom-[72px] left-4 z-40 bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg border border-white/10 text-xs font-inter">
      <div className="relative">
        <Users className="h-3.5 w-3.5 text-accent" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
      <span className="font-semibold text-white">{count.toLocaleString("ru-RU")}</span>
      <span className="text-white/50">посетителей</span>
    </div>
  );
}