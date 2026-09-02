import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

/** Deterministic-on-client particle field + drifting fog + cursor light. */
export function Atmosphere({ density = 46 }: { density?: number }) {
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const root = rootRef.current;
    if (!root) return;

    let raf = 0;

    const commit = (clientX: number, clientY: number) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const x = (clientX / w - 0.5) * 18;
      const y = (clientY / h - 0.5) * 14;

      root.style.setProperty("--atm-x", `${x}px`);
      root.style.setProperty("--atm-y", `${y}px`);
      root.style.setProperty("--atm-gx", `${(clientX / w) * 100}%`);
      root.style.setProperty("--atm-gy", `${(clientY / h) * 100}%`);
    };

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => commit(event.clientX, event.clientY));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        left: (i * 37.7) % 100,
        top: (i * 61.3) % 100,
        size: 0.75 + ((i * 13) % 6) * 0.18,
        delay: -((i % 12) * 1.2),
        dur: 16 + ((i * 7) % 15),
        opacity: 0.045 + ((i * 17) % 60) / 900,
        driftX: (((i * 29) % 100) / 100 - 0.5) * 180,
        driftY: -24 - (((i * 43) % 100) / 100) * 96,
      })),
    [density],
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={
        {
          "--atm-x": "0px",
          "--atm-y": "0px",
          "--atm-gx": "50%",
          "--atm-gy": "50%",
        } as CSSProperties
      }
    >
      {/* deep gradient sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 8%, color-mix(in oklab, var(--elem) 22%, transparent), transparent 60%), radial-gradient(90% 70% at 85% 90%, color-mix(in oklab, var(--elem-soft) 18%, transparent), transparent 65%), linear-gradient(180deg, oklch(0.09 0.03 275), oklch(0.13 0.05 280))",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          transform: "translate3d(calc(var(--atm-x) * 0.2), calc(var(--atm-y) * 0.16), 0)",
        }}
      >
        <div className="starfield absolute inset-0 opacity-60 animate-drift-slow" />
      </div>
      {/* fog layers */}
      <div
        className="absolute -inset-x-40 bottom-[-10%] h-[60%] opacity-45 blur-3xl"
        style={{
          transform: "translate3d(calc(var(--atm-x) * 0.08), calc(var(--atm-y) * 0.06), 0)",
        }}
      >
        <div
          className="absolute inset-0 animate-ambient-fog"
          style={{
            background:
              "radial-gradient(60% 60% at 30% 60%, color-mix(in oklab, var(--elem-soft) 35%, transparent), transparent 70%)",
          }}
        />
      </div>
      <div
        className="absolute -inset-x-40 top-[-15%] h-[55%] opacity-35 blur-3xl"
        style={{
          transform: "translate3d(calc(var(--atm-x) * -0.05), calc(var(--atm-y) * -0.04), 0)",
        }}
      >
        <div
          className="absolute inset-0 animate-ambient-fog-rev"
          style={{
            background:
              "radial-gradient(50% 60% at 70% 40%, color-mix(in oklab, var(--elem-glow) 28%, transparent), transparent 70%)",
          }}
        />
      </div>
      <div
        className="absolute inset-[-12%] opacity-30 blur-3xl"
        style={{
          transform: "translate3d(calc(var(--atm-x) * 0.04), calc(var(--atm-y) * 0.03), 0)",
        }}
      >
        <div
          className="absolute inset-0 animate-ambient-sweep"
          style={{
            background:
              "radial-gradient(55% 42% at var(--atm-gx) var(--atm-gy), color-mix(in oklab, var(--elem-glow) 20%, transparent), transparent 72%)",
            mixBlendMode: "screen",
          }}
        />
      </div>
      {mounted &&
        particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full animate-ambient-ember"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              background: "var(--elem-glow)",
              boxShadow: "0 0 10px 1px color-mix(in oklab, var(--elem-glow) 62%, transparent)",
              filter: "blur(0.15px)",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              "--ember-dx": `${p.driftX}px`,
              "--ember-dy": `${p.driftY}px`,
              "--ember-opacity": `${p.opacity}`,
            } as CSSProperties}
          />
        ))}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 24%, color-mix(in oklab, var(--elem-glow) 22%, transparent), transparent 34%), radial-gradient(circle at 50% 78%, color-mix(in oklab, var(--elem-soft) 18%, transparent), transparent 44%)",
          transform: "translate3d(calc(var(--atm-x) * 0.02), calc(var(--atm-y) * 0.02), 0)",
        }}
      />
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
