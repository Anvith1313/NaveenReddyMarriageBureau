"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send } from "lucide-react";

function useDebounce<T>(value: T, delay: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export interface Action {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
}

interface SearchResult {
  actions: Action[];
}

const container = {
  hidden: { opacity: 0, height: 0 },
  show: {
    opacity: 1,
    height: "auto",
    transition: { height: { duration: 0.3 }, staggerChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { height: { duration: 0.25 }, opacity: { duration: 0.15 } },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function ActionSearchBar({ actions = [] }: { actions?: Action[] }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!isFocused) { setResult(null); return; }
    if (!debouncedQuery) { setResult({ actions }); return; }
    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    setResult({
      actions: actions.filter(a => a.label.toLowerCase().includes(normalizedQuery)),
    });
  }, [debouncedQuery, isFocused, actions]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative flex flex-col justify-start items-center">
        <div className="w-full sticky top-0 z-10 pt-2 pb-1" style={{ background: "#FFFDF8" }}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              style={{
                width: "100%",
                padding: "0.5rem 2.25rem 0.5rem 0.75rem",
                background: "#FFFFFF",
                border: "1px solid #E7D9C8",
                borderRadius: 6,
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "0.875rem",
                color: "#3A2B23",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "#7B1E3C"; setSelectedAction(null); setIsFocused(true); }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div key="send" initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Send className="w-4 h-4" style={{ color: "#C8A24A" }} />
                  </motion.div>
                ) : (
                  <motion.div key="search" initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Search className="w-4 h-4" style={{ color: "#6B5C52" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full">
          <AnimatePresence>
            {isFocused && result && !selectedAction && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{
                  width: "100%",
                  border: "1px solid #E7D9C8",
                  borderRadius: 8,
                  boxShadow: "0 4px 24px rgba(123,30,60,0.08)",
                  overflow: "hidden",
                  background: "#FFFFFF",
                  marginTop: 4,
                }}
              >
                <motion.ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {result.actions.map(action => (
                    <motion.li
                      key={action.id}
                      variants={item}
                      layout
                      onClick={() => setSelectedAction(action)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        borderRadius: 6,
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F8F3EA")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        {action.icon && <span>{action.icon}</span>}
                        <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", fontWeight: 500, color: "#3A2B23" }}>
                          {action.label}
                        </span>
                        {action.description && (
                          <span style={{ fontSize: "0.75rem", color: "#6B5C52" }}>{action.description}</span>
                        )}
                      </div>
                      {action.end && (
                        <span style={{ fontSize: "0.72rem", color: "#C8A24A", fontFamily: "var(--font-inter)" }}>{action.end}</span>
                      )}
                    </motion.li>
                  ))}
                  {result.actions.length === 0 && (
                    <li style={{ padding: "0.75rem", textAlign: "center", fontSize: "0.82rem", color: "#6B5C52", fontStyle: "italic" }}>
                      No results found
                    </li>
                  )}
                </motion.ul>
                <div style={{ padding: "0.5rem 0.75rem", borderTop: "1px solid #E7D9C8", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.7rem", color: "#6B5C52" }}>↑↓ navigate</span>
                  <span style={{ fontSize: "0.7rem", color: "#6B5C52" }}>ESC to close</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export { ActionSearchBar };
