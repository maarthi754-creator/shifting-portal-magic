import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Atmosphere, CursorLight } from "@/components/Atmosphere";
import { Hud, FlashLayer } from "@/components/Hud";
import { SigilRow, DragonEgg } from "@/components/Secrets";
import { DRAGONS, REALM_MAP } from "@/game/data";
import { useGame } from "@/game/store";
import { playSound } from "@/lib/sound";

export const Route = createFileRoute("/dragons")({
  head: () => ({
    meta: [
      { title: "Choose Your Dragon — The Dragon Portal" },
      {
        name: "description",
        content:
          "Bond with Pyrrhax, Vandrel, Nyxaris or Thalvex. Your dragon decides which realms the portal will allow you to reach.",
      },
      { property: "og:title", content: "Choose Your Dragon — The Dragon Portal" },
      {
        property: "og:description",
        content: "Four dragons, four sets of realms. The portal only opens what your bond allows.",
      },
    ],
  }),
  component: DragonSelection,
});

function DragonSelection() {
  const navigate = useNavigate();
  const { state, chooseDragon, pushFlash } = useGame();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const secretUnlocked = state.secrets.includes("sigil-sequence");
  const roster = DRAGONS.filter((d) => !d.secret || secretUnlocked);

  const pick = (id: string) => {
    playSound("dragon-select", 0.9);
    setSelected(id);
    chooseDragon(id);
    pushFlash({
      kind: "omen",
      title: "the bond is sealed",
      body: "The portal has rewritten its destinations around your choice.",
    });
    setTimeout(() => navigate({ to: "/portal" }), 620);
  };

  return (
    <main data-elem={hovered ? DRAGONS.find((d) => d.id === hovered)?.element : "shadow"}>
      <Atmosphere />
      <CursorLight />
      <Hud showBack={Boolean(state.dragonId)} />
      <FlashLayer />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-ui text-[11px] tracking-[0.5em] text-muted-foreground">STEP ONE</p>
          <h1 className="mt-3 font-display text-3xl text-elem-glow sm:text-5xl">CHOOSE YOUR DRAGON</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/70">
            The bond decides the map. A rider of fire will never be shown the frozen kingdoms — and
            the portal is not obliged to explain what it hides.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roster.map((d, i) => (
            <motion.button
              key={d.id}
              data-elem={d.element}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.7 }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onPointerEnter={() => {
                setHovered(d.id);
                playSound("dragon-hover", 0.55);
              }}
              onPointerLeave={() => setHovered(null)}
              onClick={() => pick(d.id)}
              className={`glass group relative overflow-hidden rounded-3xl p-6 text-left transition-shadow hover:elem-glow ${selected === d.id ? "dragon-bonding" : ""}`}
            >
              <div
                className="absolute inset-x-0 -top-24 h-48 opacity-60 blur-3xl transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--elem-glow) 55%, transparent), transparent 70%)",
                }}
              />
              <div className="relative">
                <div className="flex items-baseline justify-between">
                  <span className="text-4xl animate-float-y">{d.glyph}</span>
                  <span className="font-ui text-[10px] tracking-[0.3em] text-elem">
                    {d.element.toUpperCase()}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-2xl text-elem-glow">{d.name}</h2>
                <p className="font-ui text-[11px] tracking-[0.25em] text-muted-foreground">
                  {d.tagline.toUpperCase()}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">{d.description}</p>
                <p className="mt-4 rounded-xl border border-border/70 px-3 py-2 text-xs text-foreground/70">
                  <span className="text-elem">ABILITY · </span>
                  {d.ability}
                </p>
                <div className="mt-4 space-y-1">
                  <p className="font-ui text-[10px] tracking-[0.3em] text-muted-foreground">
                    REALMS THIS BOND OPENS
                  </p>
                  {d.realms.slice(0, 3).map((r) => (
                    <p key={r} className="text-xs text-foreground/65">
                      · {REALM_MAP[r]?.name ?? "???"}
                    </p>
                  ))}
                </div>
                <p className="mt-5 font-display text-xs tracking-[0.3em] text-elem-glow opacity-0 transition-opacity group-hover:opacity-100">
                  BOND →
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-5">
            <SigilRow />
            <p className="max-w-[16rem] text-[11px] leading-relaxed text-muted-foreground">
              Three sigils were carved here long before the portal. Nobody wrote down the order.
            </p>
          </div>
          <DragonEgg />
        </div>
      </div>
    </main>
  );
}
