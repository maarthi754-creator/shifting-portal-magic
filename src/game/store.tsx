import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DRAGON_MAP, REALM_MAP, REALMS, SECRETS, type ElementKey } from "./data";

const STORAGE_KEY = "dragon-portal-state-v1";

export interface GameState {
  dragonId: string | null;
  visited: string[];
  banished: string[];
  spawned: string[];
  secrets: string[];
  portalReturns: number;
  sound: boolean;
  shuffleSeed: number;
}

const initialState: GameState = {
  dragonId: null,
  visited: [],
  banished: [],
  spawned: [],
  secrets: [],
  portalReturns: 0,
  sound: false,
  shuffleSeed: 1,
};

interface Flash {
  id: number;
  kind: "secret" | "omen" | "taunt";
  title: string;
  body: string;
}

interface Ctx {
  state: GameState;
  dragon: ReturnType<typeof getDragon>;
  element: ElementKey;
  availableRealms: string[];
  visitRealm: (id: string) => void;
  registerPortalReturn: () => void;
  unlockSecret: (id: string) => void;
  chooseDragon: (id: string) => void;
  toggleSound: () => void;
  reset: () => void;
  flashes: Flash[];
  pushFlash: (f: Omit<Flash, "id">) => void;
  dismissFlash: (id: number) => void;
  totalRealms: number;
}

function getDragon(id: string | null) {
  return id ? (DRAGON_MAP[id] ?? null) : null;
}

const GameContext = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const flashId = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const pushFlash = useCallback((f: Omit<Flash, "id">) => {
    const id = ++flashId.current;
    setFlashes((prev) => [...prev, { ...f, id }].slice(-3));
    setTimeout(() => setFlashes((prev) => prev.filter((x) => x.id !== id)), 5200);
  }, []);

  const dismissFlash = useCallback(
    (id: number) => setFlashes((prev) => prev.filter((x) => x.id !== id)),
    [],
  );

  const chooseDragon = useCallback((id: string) => {
    setState((s) => ({ ...s, dragonId: id, shuffleSeed: s.shuffleSeed + 7 }));
  }, []);

  const unlockSecret = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.secrets.includes(id)) return s;
        const secret = SECRETS.find((x) => x.id === id);
        const spawned = [...s.spawned];
        if (id === "rune-vigil" && !spawned.includes("whispering-nexus"))
          spawned.push("whispering-nexus");
        if (id === "fold" && !spawned.includes("the-in-between")) spawned.push("the-in-between");
        if (secret)
          pushFlash({ kind: "secret", title: `✦ ${secret.title} ✦`, body: secret.reveal });
        return { ...s, secrets: [...s.secrets, id], spawned, shuffleSeed: s.shuffleSeed + 3 };
      });
    },
    [pushFlash],
  );

  const visitRealm = useCallback(
    (id: string) => {
      setState((s) => {
        const realm = REALM_MAP[id];
        if (!realm) return s;
        const visited = s.visited.includes(id) ? s.visited : [...s.visited, id];
        const banished = Array.from(
          new Set([...s.banished, ...(realm.banishes ?? [])]),
        ).filter((b) => b !== id);
        const spawned = Array.from(new Set([...s.spawned, ...(realm.spawns ?? [])]));
        return { ...s, visited, banished, spawned, shuffleSeed: s.shuffleSeed + 5 };
      });
    },
    [],
  );

  const registerPortalReturn = useCallback(() => {
    setState((s) => {
      const next = { ...s, portalReturns: s.portalReturns + 1, shuffleSeed: s.shuffleSeed + 11 };
      return next;
    });
  }, []);

  const toggleSound = useCallback(() => setState((s) => ({ ...s, sound: !s.sound })), []);
  const reset = useCallback(() => setState({ ...initialState, sound: false }), []);

  const dragon = getDragon(state.dragonId);

  const availableRealms = useMemo(() => {
    const base = dragon ? [...dragon.realms] : [];
    const all = Array.from(new Set([...base, ...state.spawned]));
    return all.filter((id) => REALM_MAP[id] && !state.banished.includes(id));
  }, [dragon, state.spawned, state.banished]);

  const element: ElementKey = dragon?.element ?? "shadow";

  // Secret 3: fold — return to portal enough times after visiting 2+ realms
  useEffect(() => {
    if (
      state.visited.length >= 2 &&
      state.portalReturns >= 3 &&
      !state.secrets.includes("fold")
    ) {
      unlockSecret("fold");
    }
  }, [state.visited.length, state.portalReturns, state.secrets, unlockSecret]);

  const value: Ctx = {
    state,
    dragon,
    element,
    availableRealms,
    visitRealm,
    registerPortalReturn,
    unlockSecret,
    chooseDragon,
    toggleSound,
    reset,
    flashes,
    pushFlash,
    dismissFlash,
    totalRealms: REALMS.length,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}

/** deterministic pseudo random from a seed + key */
export function seeded(seed: number, key: string) {
  let h = seed * 2654435761;
  for (let i = 0; i < key.length; i++) h = (h ^ key.charCodeAt(i)) * 16777619;
  h = Math.abs(h);
  return (h % 100000) / 100000;
}
