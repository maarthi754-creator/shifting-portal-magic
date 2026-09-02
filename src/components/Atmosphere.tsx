import { useEffect, useMemo, useRef, useState } from "react";

/** Deterministic-on-client particle field + drifting fog + cursor light. */
export function Atmosphere({ density = 46 }: { density?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const particles = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        left: (i * 37.7) % 100,
        top: (i * 61.3) % 100,
        size: 1 + ((i * 13) % 4),
        delay: (i % 12) * 0.7,
        dur: 6 + ((i * 7) % 11),
        opacity: 0.15 + ((i * 17) % 60) / 140,
      })),
    [density],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* deep gradient sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 8%, color-mix(in oklab, var(--elem) 22%, transparent), transparent 60%), radial-gradient(90% 70% at 85% 90%, color-mix(in oklab, var(--elem-soft) 18%, transparent), transparent 65%), linear-gradient(180deg, oklch(0.09 0.03 275), oklch(0.13 0.05 280))",
        }}
      />
      <div className="starfield absolute inset-0 opacity-70 animate-drift-slow" />
      {/* fog layers */}
      <div
        className="absolute -inset-x-40 bottom-[-10%] h-[60%] animate-drift-slow opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 60%, color-mix(in oklab, var(--elem-soft) 35%, transparent), transparent 70%)",
          animationDuration: "55s",
        }}
      />
      <div
        className="absolute -inset-x-40 top-[-15%] h-[55%] animate-drift-slow opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 60% at 70% 40%, color-mix(in oklab, var(--elem-glow) 28%, transparent), transparent 70%)",
          animationDuration: "70s",
          animationDirection: "alternate-reverse",
        }}
      />
      {mounted &&
        particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full animate-float-y"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              background: "var(--elem-glow)",
              boxShadow: "0 0 12px 2px color-mix(in oklab, var(--elem-glow) 70%, transparent)",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
    </div>
  );
}

/** Magical light that follows the cursor. */
export function CursorLight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${e.clientX - 260}px, ${e.clientY - 260}px, 0)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] hidden h-[520px] w-[520px] rounded-full opacity-60 mix-blend-screen md:block"
      style={{
        background:
          "radial-gradient(circle, color-mix(in oklab, var(--elem-glow) 22%, transparent), transparent 62%)",
        transition: "transform 120ms cubic-bezier(.2,.8,.2,1)",
      }}
    />
  );
}
