"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check } from "lucide-react";

interface RichSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  /** aria-label for accessibility */
  ariaLabel?: string;
  /** Dark theme for use on dark backgrounds */
  dark?: boolean;
}

const listVariants = {
  hidden: { opacity: 0, y: -6, scaleY: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -4,
    scaleY: 0.97,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.018, duration: 0.18 },
  }),
};

export function RichSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  label,
  disabled = false,
  ariaLabel,
  dark = false,
}: RichSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else setSearch("");
  }, [open]);

  // Keyboard: Escape closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setSearch(""); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function select(opt: string) {
    onChange(opt);
    setOpen(false);
    setSearch("");
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Trigger — matches the underline input style from signup.module.css */}
      <button
        type="button"
        aria-label={ariaLabel ?? label ?? placeholder}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.65rem 0.1rem",
          background: "transparent",
          border: "none",
          borderBottom: dark
            ? `1px solid ${open ? "#C8A24A" : "rgba(200,162,74,0.22)"}`
            : `1.5px solid ${open ? "#7B1E3C" : "#E7D9C8"}`,
          borderRadius: 0,
          fontFamily: dark ? "var(--font-heading), 'Cormorant Garamond', serif" : "var(--font-inter), 'Inter', sans-serif",
          fontSize: dark ? "1.25rem" : "0.975rem",
          color: dark
            ? (value ? "#F5EDD8" : "rgba(245,237,216,0.22)")
            : (value ? "#3A2B23" : "rgba(107,92,82,0.38)"),
          cursor: disabled ? "not-allowed" : "pointer",
          textAlign: "left",
          outline: "none",
          transition: "border-color 0.2s",
          opacity: disabled ? 0.55 : 1,
        }}
      >
        <span>{value || placeholder}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", flexShrink: 0, marginLeft: 4 }}
        >
          <ChevronDown size={14} style={{ color: "#C8A24A" }} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            variants={listVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: dark ? "#1A0A10" : "#FFFFFF",
              border: dark ? "1px solid rgba(200,162,74,0.2)" : "1px solid #E7D9C8",
              borderRadius: 12,
              boxShadow: dark
                ? "0 16px 48px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(123,30,60,0.1), 0 2px 8px rgba(123,30,60,0.06)",
              zIndex: 200,
              overflow: "hidden",
              transformOrigin: "top",
            }}
          >
            {/* Search input inside dropdown */}
            {options.length > 6 && (
              <div
                style={{
                  padding: "0.5rem 0.75rem",
                  borderBottom: dark ? "1px solid rgba(200,162,74,0.15)" : "1px solid #E7D9C8",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: dark ? "#130810" : "#FFFDF8",
                }}
              >
                <Search size={13} style={{ color: dark ? "rgba(200,162,74,0.5)" : "#6B5C52", flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search…"
                  title="Search options"
                  aria-label="Search options"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.82rem",
                    color: dark ? "rgba(245,237,216,0.75)" : "#3A2B23",
                  }}
                />
              </div>
            )}

            {/* Options list */}
            <ul style={{ listStyle: "none", padding: "0.3rem 0", margin: 0, maxHeight: 224, overflowY: "auto" }}>
              {filtered.length === 0 && (
                <li style={{ padding: "0.6rem 0.9rem", fontSize: "0.82rem", color: "#6B5C52", fontStyle: "italic", textAlign: "center" }}>
                  No options found
                </li>
              )}
              {filtered.map((opt, i) => (
                <motion.li
                  key={opt}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  onClick={() => select(opt)}
                  style={{
                    padding: "0.55rem 0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: opt === value ? 600 : 400,
                    color: dark
                      ? (opt === value ? "#EDD898" : "rgba(245,237,216,0.72)")
                      : (opt === value ? "#7B1E3C" : "#3A2B23"),
                    background: dark
                      ? (opt === value ? "rgba(200,162,74,0.12)" : "transparent")
                      : (opt === value ? "rgba(123,30,60,0.04)" : "transparent"),
                    transition: "background 0.14s",
                  }}
                  onMouseEnter={e => {
                    if (opt !== value) e.currentTarget.style.background = dark ? "rgba(200,162,74,0.07)" : "#F8F3EA";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = opt === value
                      ? (dark ? "rgba(200,162,74,0.12)" : "rgba(123,30,60,0.04)")
                      : "transparent";
                  }}
                >
                  {opt}
                  {opt === value && <Check size={13} style={{ color: "#C8A24A", flexShrink: 0 }} />}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
