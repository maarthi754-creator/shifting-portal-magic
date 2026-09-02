import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Atmosphere, CursorLight } from "@/components/Atmosphere";
import { Hud, FlashLayer } from "@/components/Hud";
import { Portal } from "@/components/Portal";
import { PatientRune, DragonEgg, SigilRow } from "@/components/Secrets";
import { PORTAL_TAUNTS, REALM_MAP, SECRETS } from "@/game/data";
import { seeded, useGame } from "@/game/store";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "The Living Portal Map — The Dragon Portal" },
      {
        name: "description",
        content:
          "A portal map that rearranges itself. Realms vanish, secrets surface, and the destinations depend on everything you have already done.",
      },
      { property: "og:title", content: "The Living Portal Map" },
      {
        property: "og:description",
        content: "Realms appear, vanish and move. The portal remembers every route you took.",
      },
    ],
  }),
  component: PortalWorld,
});

function PortalWorld() {
  const navigate = useNavigate();
  const {
    state,
    dragon,
    availableRealms,
    registerPortalReturn,
    pushFlash,
    totalRealms,
  } = useGame();
  const [taunt, setTaunt] = useState<string>(PORTAL_TAUNTS[0]!);
  const [leaving, setLeaving] = useState<string | null>(null);
  const entered = useRef(false);

  useEffect(() => {
    if (!state.dragonId && typeof window !== "undefined") {
      navigate({ to: "/dragons" });
    }
  }, [state.dragonId, navigate]);

  useEffect(() => {
    if (entered.current) return;
    entered.current = true;
    registerPortalReturn();
  }, [registerPortalReturn]);

  useEffect(() => {
    const t = setInterval(() => {
      setTaunt(PORTAL_TAUNTS[Math.floor(Math.random() * PORTAL_TAUNTS.length)]!);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const seed = state.shuffleSeed + state.portalReturns * 13;

  const nodes = useMemo(() => {
    const list = [...availableRealms];
    // seeded reordering so positions genuinely change each return
    list.sort((a, b) => seeded(seed, a) - seeded(seed, b));
    const n = Math.max(list.length, 1);
    return list.map((id, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2 + seeded(seed, id + "a") * 0.5;
      const radius = 30 + seeded(seed, id + "r") * 12;
      return {
        id,
        realm: REALM_MAP[id]!,
        x: 50 + Math.cos(angle) * radius * 1.45,
        y: 50 + Math.sin(angle) * radius,
        visited: state.visited.includes(id),
        delay: i * 0.06,
      };
    });
  }, [availableRealms, seed, state.visited]);

  const banishedNames = state.banished
    .map((b) => REALM_MAP[b]?.name)
    .filter(Boolean) as string[];

  const go = (id: string) => {
    setLeaving(id);
    setTimeout(() => navigate({ to: "/realm/$realmId", params: { realmId: id } }), 900);
  };

  return (
    <main data-elem={dragon?.element ?? "shadow"} className="relative min-h-screen overflow-hidden">
      <Atmosphere density={54} />
      <CursorLight />
      <Hud showBack={false} />
      <FlashLayer />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-28">
        <div className="text-center">
          <p className="font-ui text-[11px] tracking-[0.5em] text-muted-foreground">
            THE LIVING MAP · SHIFT {state.portalReturns}
          </p>
          <h1 className="mt-3 font-display text-3xl text-elem-glow sm:text-4xl">
            {dragon ? `${dragon.name.toUpperCase()} HOLDS THE GATE` : "THE PORTAL"}
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={taunt}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-3 font-ui text-sm italic tracking-widest text-foreground/60"
            >
              “{taunt}”
            </motion.p>
          </AnimatePresence>
        </div>

        {/* MAP */}
        <div className="relative mx-auto mt-10 h-[560px] w-full max-w-5xl sm:h-[620px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {nodes.map((n) => (
              <line
                key={n.id}
                x1="50"
                y1="50"
                x2={n.x}
                y2={n.y}
                stroke="var(--elem)"
                strokeOpacity={n.visited ? 0.5 : 0.22}
                strokeWidth="0.22"
                strokeDasharray="1.6 1.4"
                style={{ animation: "dash-flow 9s linear infinite" }}
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Portal
              size={260}
              intensity={1 + state.secrets.length * 0.15}
              label={
                <div>
                  <p className="font-display text-xs tracking-[0.3em] text-background/90">
                    {availableRealms.length} OPEN
                  </p>
                </div>
              }
            />
          </div>

          {nodes.map((n) => (
            <RealmNode
              key={n.id + seed}
              x={n.x}
              y={n.y}
              delay={n.delay}
              visited={n.visited}
              name={n.realm.name}
              glyph={n.realm.glyph}
              blurb={n.realm.blurb}
              danger={n.realm.danger}
              hidden={Boolean(n.realm.hidden)}
              evasive={seeded(seed, n.id + "e") > 0.62}
              onEnter={() => go(n.id)}
            />
          ))}

          <div className="absolute -bottom-2 left-2">
            <PatientRune />
          </div>
          <div className="absolute -bottom-4 right-2 hidden sm:block">
            <DragonEgg />
          </div>
        </div>

        {/* Status panels */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Panel title="RIDER LOG">
            <p className="text-sm text-foreground/75">
              Realms discovered <span className="text-elem-glow">{state.visited.length}</span> /{" "}
              {totalRealms}
            </p>
            <p className="text-sm text-foreground/75">
              Secrets found <span className="text-elem-glow">{state.secrets.length}</span> /{" "}
              {SECRETS.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Map shifts: {state.portalReturns}. The portal insists it has not moved anything.
            </p>
          </Panel>
          <Panel title="BANISHED BY YOUR CHOICES">
            {banishedNames.length ? (
              <ul className="space-y-1 text-sm text-foreground/60 line-through">
                {banishedNames.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nothing yet. Enter a realm and something else will stop existing.
              </p>
            )}
          </Panel>
          <Panel title="WHISPERS">
            <ul className="space-y-2 text-xs text-muted-foreground">
              {SECRETS.map((s) => (
                <li key={s.id} className={state.secrets.includes(s.id) ? "text-elem-glow" : ""}>
                  {state.secrets.includes(s.id) ? `✦ ${s.title} — ${s.reveal}` : `· ${s.hint}`}
                </li>
              ))}
            </ul>
            <SigilRow className="mt-4" />
          </Panel>
        </div>

        <button
          onClick={() =>
            pushFlash({
              kind: "taunt",
              title: "the portal considers it",
              body: "Re-bonding costs you nothing. It costs the map everything.",
            }) || navigate({ to: "/dragons" })
          }
          className="mx-auto mt-10 block font-ui text-xs tracking-[0.3em] text-muted-foreground underline-offset-8 transition hover:text-elem-glow hover:underline"
        >
          CHANGE YOUR BOND
        </button>
      </div>

      <AnimatePresence>
        {leaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-background/95"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0.3 }}
              animate={{ scale: 12, opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.7, 0, 0.3, 1] }}
              className="h-40 w-40 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--elem-glow), color-mix(in oklab, var(--elem) 60%, transparent) 45%, transparent 70%)",
              }}
            />
            <p className="absolute font-display text-sm tracking-[0.4em] text-background/90">
              {REALM_MAP[leaving]?.name.toUpperCase()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="font-ui text-[10px] tracking-[0.35em] text-elem">{title}</p>
      <div className="mt-3 space-y-1">{children}</div>
    </div>
  );
}

interface NodeProps {
  x: number;
  y: number;
  delay: number;
  visited: boolean;
  hidden: boolean;
  evasive: boolean;
  name: string;
  glyph: string;
  blurb: string;
  danger: string;
  onEnter: () => void;
}

function RealmNode(props: NodeProps) {
  const [dodge, setDodge] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);

  const handleEnter = () => {
    if (props.evasive && dodges < 2) {
      setDodges((d) => d + 1);
      setDodge({ x: (Math.random() - 0.5) * 120, y: (Math.random() - 0.5) * 90 });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, x: dodge.x, y: dodge.y }}
      transition={{ delay: props.delay, type: "spring", stiffness: 180, damping: 18 }}
      whileHover={{ scale: 1.06 }}
      onPointerEnter={handleEnter}
      onClick={props.onEnter}
      className="glass group absolute z-20 w-[186px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4 text-left hover:elem-glow"
      style={{
        left: `${props.x}%`,
        top: `${props.y}%`,
        borderColor: props.hidden ? "var(--elem-glow)" : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{props.glyph}</span>
        {props.hidden && (
          <span className="animate-rune font-ui text-[9px] tracking-[0.25em] text-elem-glow">
            ANOMALY
          </span>
        )}
        {props.visited && !props.hidden && (
          <span className="font-ui text-[9px] tracking-[0.25em] text-muted-foreground">SEEN</span>
        )}
      </div>
      <p className="mt-2 font-display text-sm text-elem-glow">{props.name}</p>
      <p className="mt-1 text-[11px] leading-snug text-foreground/60">{props.blurb}</p>
      <p className="mt-2 font-ui text-[9px] tracking-[0.25em] text-muted-foreground">
        DANGER · {props.danger.toUpperCase()}
      </p>
      {props.evasive && dodges > 0 && (
        <p className="mt-1 text-[10px] italic text-elem">it moved. it always does.</p>
      )}
    </motion.button>
  );
}
