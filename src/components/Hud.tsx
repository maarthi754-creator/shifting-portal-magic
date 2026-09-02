import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Volume2, VolumeX, RotateCcw, Sparkles, Map } from "lucide-react";
import { useGame } from "@/game/store";
import { SECRETS } from "@/game/data";
import { playSound } from "@/lib/sound";

export function Hud({ showBack = true }: { showBack?: boolean }) {
  const { state, dragon, toggleSound, reset, totalRealms } = useGame();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-4 md:p-6">
      <div className="pointer-events-auto glass flex items-center gap-4 rounded-full px-4 py-2 md:px-5 md:py-2.5">
        <span className="font-display text-[11px] tracking-[0.28em] text-elem-glow md:text-xs">
          THE PORTAL
        </span>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <span className="hidden items-center gap-1.5 font-ui text-xs tracking-widest text-muted-foreground sm:flex">
          <Map className="h-3.5 w-3.5" /> REALMS {state.visited.length}/{totalRealms}
        </span>
        <span className="hidden items-center gap-1.5 font-ui text-xs tracking-widest text-muted-foreground sm:flex">
          <Sparkles className="h-3.5 w-3.5" /> SECRETS {state.secrets.length}/{SECRETS.length}
        </span>
        {dragon && (
          <span className="font-ui text-xs tracking-widest text-elem">
            {dragon.glyph} {dragon.name.toUpperCase()}
          </span>
        )}
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        {showBack && (
          <Link
            to="/portal"
            className="glass rounded-full px-4 py-2 font-ui text-xs tracking-[0.2em] text-foreground/85 transition hover:text-elem-glow"
          >
            PORTAL
          </Link>
        )}
        <button
          onClick={() => {
            playSound("ui", 0.35);
            toggleSound();
          }}
          aria-label="Toggle sound"
          className="glass grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:text-elem-glow"
        >
          {state.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
        <button
          onClick={() => {
            playSound("ui", 0.35);
            reset();
          }}
          aria-label="Reset the portal's memory"
          className="glass grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition hover:text-destructive"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function FlashLayer() {
  const { flashes } = useGame();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-3 px-4">
      <AnimatePresence>
        {flashes.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className={`glass elem-glow max-w-md rounded-2xl px-6 py-4 text-center ${
              f.kind === "secret" ? "border-elem" : ""
            }`}
          >
            <p className="font-display text-sm tracking-[0.22em] text-elem-glow">{f.title}</p>
            <p className="mt-1 text-sm text-foreground/80">{f.body}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
