"use client";

import React, {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Check, Loader2, Heart, X } from "lucide-react";

const DRAG_CONSTRAINTS = { left: 0, right: 155 };
const DRAG_THRESHOLD = 0.9;

const BUTTON_STATES = {
  initial: { width: "13rem" },
  completed: { width: "9rem" },
};

const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  mass: 0.8,
};

type StatusIconProps = { status: string };

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const iconMap: Record<string, JSX.Element> = useMemo(
    () => ({
      loading: <Loader2 className="animate-spin" size={18} />,
      success: <Check size={18} />,
      error: <X size={18} />,
    }),
    []
  );
  if (!iconMap[status]) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      {iconMap[status]}
    </motion.div>
  );
};

interface SlideButtonProps {
  onComplete?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const SlideButton = forwardRef<HTMLDivElement, SlideButtonProps>(
  ({ onComplete, label = "Slide to Express Interest", className = "", disabled = false }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const dragHandleRef = useRef<HTMLDivElement | null>(null);

    const dragX = useMotionValue(0);
    const springX = useSpring(dragX, SPRING_CONFIG);
    const dragProgress = useTransform(springX, [0, DRAG_CONSTRAINTS.right], [0, 1]);

    // Progress-based fill width (the rose trail behind the handle)
    const fillWidth = useTransform(springX, (x) => x + 40);

    // Label opacity fades as user drags right
    const labelOpacity = useTransform(springX, [0, DRAG_CONSTRAINTS.right * 0.6], [1, 0]);

    const handleDragStart = useCallback(() => {
      if (completed || disabled) return;
      setIsDragging(true);
    }, [completed, disabled]);

    const handleDragEnd = useCallback(() => {
      if (completed || disabled) return;
      setIsDragging(false);
      if (dragProgress.get() >= DRAG_THRESHOLD) {
        setCompleted(true);
        setStatus("loading");
        onComplete?.();
        setTimeout(() => setStatus("success"), 1800);
      } else {
        dragX.set(0);
      }
    }, [completed, disabled, dragProgress, dragX, onComplete]);

    const handleDrag = useCallback(
      (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (completed || disabled) return;
        dragX.set(Math.max(0, Math.min(info.offset.x, DRAG_CONSTRAINTS.right)));
      },
      [completed, disabled, dragX]
    );

    // Track label — shown inside the track before dragging
    const trackLabel = completed
      ? status === "success"
        ? "Interest Sent!"
        : status === "loading"
        ? "Sending…"
        : label
      : label;

    return (
      <div ref={ref} className={className}>
        <motion.div
          animate={completed ? BUTTON_STATES.completed : BUTTON_STATES.initial}
          transition={SPRING_CONFIG}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 44,
            borderRadius: 50,
            background: completed
              ? status === "success"
                ? "#7B1E3C"
                : "rgba(123,30,60,0.1)"
              : "rgba(231,217,200,0.6)",
            border: "1.5px solid rgba(123,30,60,0.18)",
            overflow: "hidden",
            userSelect: "none",
            cursor: disabled ? "not-allowed" : "default",
            opacity: disabled ? 0.55 : 1,
          }}
        >
          {/* Rose progress fill */}
          {!completed && (
            <motion.div
              style={{
                width: fillWidth,
                position: "absolute",
                insetBlock: 0,
                left: 0,
                borderRadius: 50,
                background: "linear-gradient(90deg, rgba(123,30,60,0.12), rgba(123,30,60,0.06))",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}

          {/* Track label */}
          {!completed && (
            <motion.span
              style={{
                opacity: labelOpacity,
                position: "absolute",
                left: "50%",
                x: "-50%",
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#7B1E3C",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                paddingLeft: "2.5rem",
                zIndex: 1,
              }}
            >
              {label}
            </motion.span>
          )}

          {/* Draggable handle */}
          <AnimatePresence>
            {!completed && (
              <motion.div
                ref={dragHandleRef}
                drag={disabled ? false : "x"}
                dragConstraints={DRAG_CONSTRAINTS}
                dragElastic={0.04}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrag={handleDrag}
                style={{ x: springX, position: "absolute", left: -4, zIndex: 10 }}
                className="flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  animate={{ scale: isDragging ? 1.08 : 1 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#7B1E3C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 16px rgba(123,30,60,0.35), 0 1px 4px rgba(123,30,60,0.2)",
                  }}
                >
                  <Heart size={16} style={{ color: "#FFFDF8" }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completed state */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#FFFDF8",
                }}
              >
                <AnimatePresence mode="wait">
                  <StatusIcon status={status} />
                </AnimatePresence>
                {status === "success" && (
                  <motion.span
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ marginLeft: 4 }}
                  >
                    Sent!
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Helper hint */}
        {!completed && !isDragging && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 0.6 }}
            style={{
              textAlign: "center",
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "0.65rem",
              color: "#6B5C52",
              marginTop: "0.3rem",
              letterSpacing: "0.06em",
            }}
          >
            ← slide to confirm →
          </motion.p>
        )}
      </div>
    );
  }
);
SlideButton.displayName = "SlideButton";

export { SlideButton };
