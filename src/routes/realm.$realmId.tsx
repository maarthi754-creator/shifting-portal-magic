import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Atmosphere, CursorLight } from "@/components/Atmosphere";
import { Hud, FlashLayer } from "@/components/Hud";
import { PatientRune, DragonEgg } from "@/components/Secrets";
import { REALM_MAP } from "@/game/data";
import { seeded, useGame } from "@/game/store";

export const Route = createFileRoute("/realm/$realmId")({
  head: () => ({
    meta: [
      { title: "A Shifting Realm — The Dragon Portal" },
      {
        name: "description",
        content:
          "Each realm rewrites itself between visits. Layouts move, fragments vanish, and the portal leaves a different message every time.",
      },
      { property: "og:title", content: "A Shifting Realm — The Dragon Portal" },
      {
        property: "og:description",
        content: "Return to a realm and it will not be the same place you left.",
      },
    ],
  }),
  component: RealmPage,
});

const FRAGMENTS = [
  "A rider's glove, still warm.",
  "A door standing alone in open air.",
  "Bones arranged like a map legend.",
  "A bell that rings before it is struck.",
  "Footprints leading in, none leading out.",
  "A mirror showing the previous realm.",
  "A chart of routes you have not taken yet.",
  "Ash spelling a name — almost yours.",
];

const RETURN_LINES = [
  "You were here before... weren't you?",
  "Things have been moved. Not by you.",
  "This realm has been editing itself in your absence.",
  "Fewer doors than last time. Nobody will explain why.",
  "The portal insists this is the first visit. It is lying.",
];

function RealmPage() {
  const { realmId } = useParams({ from: "/realm/$realmId" });
  const navigate = useNavigate();
  const { state, dragon, visitRealm, pushFlash } = useGame();
  const realm = REALM_MAP[realmId];
  const done = useRef(false);
  const [visitIndex] = useState(() => state.visited.filter((v) => v === realmId).length);
  const returning = state.visited.includes(realmId);

  useEffect(() => {
    if (!realm || done.current) return;
    done.current = true;
    const wasVisited = state.visited.includes(realmId);
    visitRealm(realmId);
    setTimeout(() => {
      pushFlash({
        kind: wasVisited ? "taunt" : "omen",
        title: wasVisited ? "the realm shifted" : "consequence",
        body: wasVisited
          ? RETURN_LINES[Math.floor(Math.random() * RETURN_LINES.length)]!
          : realm.omen,
      });
    }, 900);
  }, [realm, realmId, state.visited, visitRealm, pushFlash]);

  const seed = state.shuffleSeed + state.portalReturns * 5 + visitIndex * 31;

  const fragments = useMemo(() => {
    const picked = FRAGMENTS.map((f, i) => ({ f, r: seeded(seed, f + i) }))
      .sort((a, b) => a.r - b.r)
      .slice(0, returning ? 3 : 5);
    return picked.map(({ f }, i) => ({
      text: f,
      x: 8 + seeded(seed, f + "x") * 74,
      y: 10 + seeded(seed, f + "y") * 66,
      delay: i * 0.12,
    }));
  }, [seed, returning]);

  if (!realm) {
    return (
      <main className="grid min-h-screen place-items-center">
        <Atmosphere />
        <div className="glass relative z-10 rounded-2xl p-8 text-center">
          <p className="font-display text-elem-glow">THAT REALM NO LONGER EXISTS.</p>
          <button
            onClick={() => navigate({ to: "/portal" })}
            className="mt-4 font-ui text-xs tracking-[0.3em] text-muted-foreground hover:text-elem-glow"
          >
            RETURN TO THE PORTAL
          </button>
        </div>
      </main>
    );
  }

  const layout = Math.floor(seeded(seed, realmId) * 3); // 0,1,2 — layout genuinely changes

  return (
    <main data-elem={realm.element} className="relative min-h-screen overflow-hidden">
      <Atmosphere density={50} />
      <CursorLight />
      <Hud />
      <FlashLayer />

      <div
        className={`relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-24 pt-28 ${
          layout === 0 ? "items-start text-left" : layout === 1 ? "items-center text-center" : "items-end text-right"
        }`}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-ui text-[11px] tracking-[0.5em] text-muted-foreground"
        >
          {returning ? `RETURN VISIT · VARIANT ${layout + 1}` : "FIRST CROSSING"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1 }}
          className="mt-3 font-display text-4xl text-elem-glow sm:text-6xl"
        >
          {realm.glyph} {realm.name.toUpperCase()}
        </motion.h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/75">{realm.lore}</p>
        <p className="mt-2 max-w-xl text-sm text-foreground/55">{realm.blurb}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Tag label={`DANGER · ${realm.danger.toUpperCase()}`} />
          <Tag label={`ELEMENT · ${realm.element.toUpperCase()}`} />
          <Tag label={`BOND · ${dragon?.name.toUpperCase() ?? "NONE"}`} />
        </div>

        {/* drifting fragments: positions differ every visit */}
        <div className="pointer-events-none relative mt-10 h-[300px] w-full">
          {fragments.map((f) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + f.delay, duration: 0.7 }}
              className="glass pointer-events-auto absolute max-w-[220px] animate-float-y rounded-xl px-4 py-3 text-xs text-foreground/70"
              style={{ left: `${f.x}%`, top: `${f.y}%`, animationDelay: `${f.delay * 3}s` }}
            >
              {f.text}
            </motion.div>
          ))}
          <div className="pointer-events-auto absolute bottom-0 left-1/2 -translate-x-1/2">
            <PatientRune />
          </div>
          <div className="pointer-events-auto absolute right-2 top-0 hidden sm:block">
            <DragonEgg />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate({ to: "/portal" })}
            className="glass elem-glow rounded-full px-8 py-3 font-display text-xs tracking-[0.3em] text-elem-glow transition hover:text-foreground"
          >
            RETURN TO THE PORTAL
          </button>
          <button
            onClick={() =>
              pushFlash({
                kind: "taunt",
                title: "deeper?",
                body: "There is no deeper. That is what the last rider was told too.",
              })
            }
            className="rounded-full border border-border/70 px-8 py-3 font-ui text-xs tracking-[0.3em] text-muted-foreground transition hover:border-elem hover:text-elem-glow"
          >
            GO DEEPER
          </button>
        </div>
      </div>
    </main>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="glass rounded-full px-4 py-1.5 font-ui text-[10px] tracking-[0.25em] text-foreground/70">
      {label}
    </span>
  );
}
