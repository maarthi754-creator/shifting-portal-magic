import { motion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { playSound } from "@/lib/sound";

interface PortalProps {
  size?: number;
  label?: ReactNode;
  intensity?: number;
  onClick?: () => void;
  className?: string;
}

/** The living portal: layered rotating rings, plasma core, drifting runes. */
export function Portal({ size = 320, label, intensity = 1, onClick, className = "" }: PortalProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  const surgeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [activity, setActivity] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [surging, setSurging] = useState(false);
  const runes = ["ᚠ", "ᚱ", "ᛉ", "ᛞ", "ᚨ", "ᛟ", "ᛊ", "ᚹ"];
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;
    let frame = 0;
    const updateActivity = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = portalRef.current?.getBoundingClientRect();
        if (!bounds) return;
        const dx = Math.max(bounds.left - event.clientX, 0, event.clientX - bounds.right);
        const dy = Math.max(bounds.top - event.clientY, 0, event.clientY - bounds.bottom);
        const distance = Math.sqrt(dx * dx + dy * dy);
        setActivity(Math.max(0, 1 - distance / Math.max(size * 0.85, 1)));
      });
    };
    window.addEventListener("pointermove", updateActivity, { passive: true });
    return () => {
      window.removeEventListener("pointermove", updateActivity);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [size]);

  const handleClick = () => {
    playSound("portal", 1);
    onClick?.();
    setSurging(true);
    if (surgeTimerRef.current) clearTimeout(surgeTimerRef.current);
    surgeTimerRef.current = setTimeout(() => setSurging(false), 1050);
  };

  useEffect(() => () => {
    if (surgeTimerRef.current) clearTimeout(surgeTimerRef.current);
  }, []);

  return (
    <motion.div
      ref={portalRef}
      className={`relative select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: onClick ? 1.04 : 1 }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div
        className={`pointer-events-none absolute inset-[-12%] rounded-full portal-energy-halo ${surging ? "portal-energy-surge" : ""}`}
        style={{ "--portal-activity": Math.min(1, activity + (hovered ? 0.45 : 0)) } as CSSProperties}
      />
      <div className="pointer-events-none absolute inset-[-5%] rounded-full portal-edge-ripple" />
      <div
        className="pointer-events-none absolute inset-[-16%] rounded-full portal-pull-field"
        style={{ "--portal-activity": Math.min(1, activity + (hovered ? 0.45 : 0)) } as CSSProperties}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className="portal-pull-particle"
            style={{
              "--particle-angle": `${i * 60 + 12}deg`,
              "--particle-distance": `${size * (0.22 + (i % 3) * 0.08)}px`,
              animationDelay: `${i * -1.7}s`,
            } as CSSProperties}
          />
        ))}
      </div>
      {/* outer aura */}
      <div
        className={`absolute inset-[-22%] rounded-full blur-3xl animate-breathe ${surging ? "portal-aura-surge" : ""}`}
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--elem-glow) 45%, transparent), transparent 65%)",
          opacity: 0.55 * intensity,
        }}
      />
      {/* rotating ring 1 */}
      <div
        className="absolute inset-0 rounded-full animate-portal-spin"
        style={{
          background: `conic-gradient(from 0deg, transparent, var(--elem-glow), transparent 42%, var(--elem), transparent 78%)`,
          maskImage: "radial-gradient(circle, transparent 62%, #000 64%, #000 78%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 62%, #000 64%, #000 78%, transparent 80%)",
        }}
      />
      {/* rotating ring 2 */}
      <div
        className="absolute inset-[7%] rounded-full animate-portal-spin-rev"
        style={{
          background: `conic-gradient(from 120deg, transparent, var(--elem), transparent 30%, var(--elem-glow), transparent 70%)`,
          maskImage: "radial-gradient(circle, transparent 70%, #000 72%, #000 86%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 70%, #000 72%, #000 86%, transparent 88%)",
        }}
      />
      {/* event horizon */}
      <div
        className="absolute inset-[16%] rounded-full animate-breathe"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--elem-glow) 85%, white 10%), color-mix(in oklab, var(--elem) 70%, transparent) 42%, oklch(0.08 0.03 275) 72%)",
          boxShadow:
            "inset 0 0 60px color-mix(in oklab, var(--elem-glow) 70%, transparent), 0 0 90px -10px color-mix(in oklab, var(--elem) 80%, transparent)",
        }}
      />
      {/* swirling core */}
      <div
        className="absolute inset-[26%] rounded-full animate-portal-spin opacity-80 blur-[2px]"
        style={{
          background: `conic-gradient(from 45deg, transparent, color-mix(in oklab, var(--elem-glow) 90%, transparent), transparent 55%, color-mix(in oklab, var(--elem) 80%, transparent), transparent)`,
          animationDuration: "9s",
        }}
      />
      {/* orbiting runes */}
      {runes.map((r, i) => {
        const a = (i / runes.length) * Math.PI * 2;
        return (
          <span
            key={r + i}
            className="absolute font-display text-elem-glow animate-rune"
            style={{
              left: `calc(50% + ${Math.cos(a) * size * 0.46}px - 8px)`,
              top: `calc(50% + ${Math.sin(a) * size * 0.46}px - 12px)`,
              fontSize: size * 0.06,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {r}
          </span>
        );
      })}
      {label && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div className="px-6">{label}</div>
        </div>
      )}
    </motion.div>
  );
}
