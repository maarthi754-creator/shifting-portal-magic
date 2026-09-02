import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Atmosphere, CursorLight } from "@/components/Atmosphere";
import { Portal } from "@/components/Portal";
import { PatientRune } from "@/components/Secrets";
import { useGame } from "@/game/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Dragon Portal That Changes Its Mind" },
      {
        name: "description",
        content:
          "A living portal to hidden realms beyond Berk. Choose a dragon, explore shifting realms, and discover secrets the portal would rather keep.",
      },
      { property: "og:title", content: "The Dragon Portal That Changes Its Mind" },
      {
        property: "og:description",
        content: "An interactive fantasy portal where every choice rewrites the map.",
      },
    ],
  }),
  component: Landing,
});

const WHISPERS = [
  "THE REALMS ARE SHIFTING...",
  "SOMETHING BEYOND BERK IS AWAKE.",
  "THE PORTAL HAS BEEN WAITING.",
  "IT REMEMBERS THE LAST RIDER.",
];

function Landing() {
  const navigate = useNavigate();
  const { state, registerPortalReturn } = useGame();
  const [whisper, setWhisper] = useState(0);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setWhisper((w) => (w + 1) % WHISPERS.length), 3600);
    return () => clearInterval(t);
  }, []);

  const enter = () => {
    setEntering(true);
    registerPortalReturn();
    setTimeout(() => navigate({ to: state.dragonId ? "/portal" : "/dragons" }), 1150);
  };

  return (
    <main data-elem={state.dragonId ? undefined : "shadow"} className="relative min-h-screen overflow-hidden">
      <Atmosphere density={60} />
      <CursorLight />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="font-ui text-[11px] tracking-[0.55em] text-muted-foreground"
        >
          BEYOND BERK · RIDER ARCHIVE VII
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 1.4 }}
          className="mt-6 max-w-4xl font-display text-4xl leading-[1.1] text-elem-glow animate-flicker sm:text-6xl md:text-7xl"
        >
          THE DRAGON PORTAL
          <span className="mt-2 block text-2xl text-foreground/75 sm:text-3xl md:text-4xl">
            that changes its mind
          </span>
        </motion.h1>

        <div className="relative mt-10 md:mt-8">
          <Portal size={340} onClick={enter} />
          <div className="pointer-events-auto absolute -right-4 top-4 md:-right-16">
            <PatientRune />
          </div>
        </div>

        <div className="mt-10 h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={whisper}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="font-ui text-sm tracking-[0.35em] text-foreground/70"
            >
              {WHISPERS[whisper]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={enter}
          className="glass elem-glow mt-8 rounded-full px-10 py-4 font-display text-sm tracking-[0.35em] text-elem-glow transition-colors hover:text-foreground"
        >
          ENTER THE PORTAL
        </motion.button>

        <p className="mt-6 max-w-md text-xs leading-relaxed text-muted-foreground">
          Every realm you enter edits the map. Every return rearranges it. Some things here only
          appear for riders who look too long.
        </p>
      </div>

      {/* cinematic transition */}
      <AnimatePresence>
        {entering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-background"
          >
            <motion.div
              initial={{ scale: 0.1, opacity: 0.4 }}
              animate={{ scale: 14, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1] }}
              className="h-40 w-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--elem-glow), color-mix(in oklab, var(--elem) 60%, transparent) 45%, transparent 70%)",
              }}
            />
            <p className="absolute font-display text-sm tracking-[0.45em] text-background/90">
              CROSSING
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
