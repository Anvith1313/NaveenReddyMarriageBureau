"use client";

import { motion } from "framer-motion";

export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    // Warm rose-gold tones matching NRMB brand
    color: i % 3 === 0
      ? `rgba(123,30,60,${0.04 + i * 0.012})`   // primary rose
      : i % 3 === 1
      ? `rgba(200,162,74,${0.04 + i * 0.01})`    // gold accent
      : `rgba(231,217,200,${0.06 + i * 0.01})`,  // parchment border
    width: 0.4 + i * 0.025,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden="true"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.022}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.55, 0.25],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface BackgroundPathsProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function BackgroundPaths({
  title = "Naveen Reddy",
  subtitle = "Marriage Bureau",
  ctaLabel = "Begin Your Journey",
  onCtaClick,
}: BackgroundPathsProps) {
  const words = title.split(" ");

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#FFFDF8]">
      {/* Animated path layers */}
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Radial champagne glow behind the heading */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(200,162,74,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Eyebrow label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#C8A24A",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ display: "block", width: 32, height: 1, background: "rgba(200,162,74,0.5)" }} />
            Est. 2000 · Exclusively Reddy Community
            <span style={{ display: "block", width: 32, height: 1, background: "rgba(200,162,74,0.5)" }} />
          </motion.p>

          {/* Animated heading */}
          <h1
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(3.5rem, 8vw, 7rem)",
              fontWeight: 700,
              fontStyle: "italic",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.12 + letterIndex * 0.028,
                      type: "spring",
                      stiffness: 140,
                      damping: 22,
                    }}
                    style={{
                      display: "inline-block",
                      color: "#7B1E3C",
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {/* Sub-title with ornamental rule */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              margin: "1.2rem 0 2rem",
            }}
          >
            <span style={{ flex: 1, maxWidth: 56, height: 1, background: "linear-gradient(to right, transparent, #C8A24A)" }} />
            <span
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: "clamp(0.75rem, 1.5vw, 1rem)",
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C8A24A",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </span>
            <span style={{ flex: 1, maxWidth: 56, height: 1, background: "linear-gradient(to left, transparent, #C8A24A)" }} />
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7, type: "spring", stiffness: 120 }}
          >
            <button
              type="button"
              onClick={onCtaClick}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.95rem 2.8rem",
                background: "#7B1E3C",
                color: "#FFFDF8",
                border: "none",
                borderRadius: 3,
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
                boxShadow: "0 4px 24px rgba(123,30,60,0.28), 0 1px 4px rgba(123,30,60,0.12)",
                transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = "#8f2347"
                el.style.transform = "translateY(-2px)"
                el.style.boxShadow = "0 8px 32px rgba(123,30,60,0.36)"
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = "#7B1E3C"
                el.style.transform = "translateY(0)"
                el.style.boxShadow = "0 4px 24px rgba(123,30,60,0.28), 0 1px 4px rgba(123,30,60,0.12)"
              }}
            >
              {ctaLabel}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            {["Verified Profiles", "100% Confidential", "25+ Years"].map((item, i) => (
              <span key={item} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#6B5C52",
                  }}
                >
                  {item}
                </span>
                {i < 2 && (
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#C8A24A", opacity: 0.5 }} />
                )}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
