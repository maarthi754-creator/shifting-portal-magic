import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useGame } from "@/game/store";
import { playSound } from "@/lib/sound";

/** SECRET 1 — hold a hover on the rune for 2 seconds. */
export function PatientRune({ className = "" }: { className?: string }) {
  const { state, unlockSecret, pushFlash } = useGame();
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const found = state.secrets.includes("rune-vigil");

  const start = () => {
    if (found || timer.current) return;
    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (timer.current) clearInterval(timer.current);
          timer.current = null;
          playSound("unlock", 0.7);
          unlockSecret("rune-vigil");
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (!found) setProgress(0);
  };
  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      onPointerEnter={start}
      onPointerLeave={stop}
      onClick={() => {
        if (!found) {
          playSound("ui", 0.3);
          pushFlash({ kind: "taunt", title: "the rune", body: "Clicking it does nothing. Waiting might." });
        }
      }}
      aria-label="A mysterious rune"
      className={`group relative grid h-14 w-14 place-items-center rounded-full ${className}`}
      style={{ opacity: found ? 1 : 0.55 }}
    >
      <span className="animate-rune font-display text-2xl text-elem-glow">{found ? "✶" : "ᛝ"}</span>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r="25"
          fill="none"
          stroke="var(--elem)"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />
        <circle
          cx="28"
          cy="28"
          r="25"
          fill="none"
          stroke="var(--elem-glow)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={157}
          strokeDashoffset={157 - (157 * (found ? 100 : progress)) / 100}
          style={{ transition: "stroke-dashoffset 90ms linear" }}
        />
      </svg>
    </button>
  );
}

const SIGILS = [
  { id: "moon", glyph: "☾" },
  { id: "eye", glyph: "👁" },
  { id: "flame", glyph: "🜂" },
];
const ORDER = ["eye", "flame", "moon"];

/** SECRET 2 — click the three sigils in the correct hidden order. */
export function SigilRow({ className = "" }: { className?: string }) {
  const { state, unlockSecret, pushFlash } = useGame();
  const [seq, setSeq] = useState<string[]>([]);
  const found = state.secrets.includes("sigil-sequence");

  const click = (id: string) => {
    if (found) return;
    playSound("ui", 0.3);
    const next = [...seq, id];
    const ok = ORDER.slice(0, next.length).every((v, i) => v === next[i]);
    if (!ok) {
      setSeq([]);
      pushFlash({ kind: "taunt", title: "the sigils dim", body: "Wrong order. The portal sighs." });
      return;
    }
    if (next.length === ORDER.length) {
      setSeq([]);
      unlockSecret("sigil-sequence");
      playSound("secret", 0.8);
      return;
    }
    setSeq(next);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SIGILS.map((s) => (
        <motion.button
          key={s.id}
          whileHover={{ scale: 1.18, rotate: 6 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => click(s.id)}
          aria-label="An unnamed sigil"
          className="grid h-10 w-10 place-items-center rounded-lg border border-border/60 text-lg text-foreground/45 transition hover:border-elem hover:text-elem-glow"
          style={
            found || seq.includes(s.id)
              ? { color: "var(--elem-glow)", borderColor: "var(--elem)" }
              : {}
          }
        >
          {s.glyph}
        </motion.button>
      ))}
    </div>
  );
}

/** SECRET 4 — the dragon egg reveals what the portal is doing. */
export function DragonEgg({ className = "" }: { className?: string }) {
  const { state, unlockSecret } = useGame();
  const [hovered, setHovered] = useState(false);
  const [hatchStage, setHatchStage] = useState<"idle" | "cracking" | "opening" | "hatched">("idle");
  const hatchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const found = state.secrets.includes("egg");

  const hatch = () => {
    if (hatchStage !== "idle") return;
    playSound("unlock", 0.8);
    setHatchStage("cracking");
    hatchTimer.current = setTimeout(() => setHatchStage("opening"), 420);
    setTimeout(() => setHatchStage("hatched"), 1050);
  };

  useEffect(() => () => {
    if (hatchTimer.current) clearTimeout(hatchTimer.current);
  }, []);

  return (
    <div
      className={`relative egg-hatch-zone ${className}`}
      data-hatch-stage={hatchStage}
      onClick={hatch}
      onPointerEnter={() => {
        setHovered(true);
        if (!found)
          setTimeout(() => {
            playSound("unlock", 0.65);
            unlockSecret("egg");
          }, 700);
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.div
        animate={hovered ? { scale: 1.1, rotate: [-2, 2, -2] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, repeat: hovered ? Infinity : 0 }}
        className="grid h-16 w-12 place-items-center rounded-[50%_50%_45%_45%/60%_60%_40%_40%] border border-border/70"
        style={{
          background:
            "radial-gradient(circle at 40% 30%, color-mix(in oklab, var(--elem-glow) 40%, transparent), oklch(0.18 0.05 280))",
          boxShadow: hovered
            ? "0 0 40px -6px color-mix(in oklab, var(--elem-glow) 80%, transparent)"
            : "none",
        }}
      >
        <span className="egg-crack egg-crack-one" />
        <span className="egg-crack egg-crack-two" />
        <span className="egg-crack egg-crack-three" />
      </motion.div>
      <span className="egg-inner-glow" aria-hidden="true" />
      <motion.span
        className="egg-hatch-dragon"
        initial={{ opacity: 0, y: 22, scale: 0.55 }}
        animate={hatchStage === "hatched" ? { opacity: 1, y: -22, scale: 1 } : { opacity: 0, y: 22, scale: 0.55 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        aria-hidden="true"
      >
        🐉
      </motion.span>
      <span className="egg-hatch-sparks" aria-hidden="true" />
      {hovered && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 top-full z-20 mt-3 w-56 -translate-x-1/2 glass rounded-xl p-3 text-center text-xs text-foreground/80"
        >
          {found
            ? "“It rewrites the map every time you look away. I've counted.”"
            : "…something inside is listening…"}
        </motion.p>
      )}
    </div>
  );
}
