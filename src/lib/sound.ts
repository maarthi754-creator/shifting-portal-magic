type SoundName =
  | "dragon-hover"
  | "dragon-select"
  | "portal"
  | "realm-enter"
  | "realm-return"
  | "secret"
  | "unlock"
  | "ui"
  | "portal-change";

const soundFiles: Record<SoundName, string> = {
  "dragon-hover": "/sounds/dragon.mp3",
  "dragon-select": "/sounds/dragon.mp3",
  portal: "/sounds/portal.mp3",
  "realm-enter": "/sounds/realm.mp3",
  "realm-return": "/sounds/realm.mp3",
  secret: "/sounds/magic.mp3",
  unlock: "/sounds/magic.mp3",
  ui: "/sounds/click.mp3",
  "portal-change": "/sounds/magic.mp3",
};

const cooldowns: Record<SoundName, number> = {
  "dragon-hover": 650,
  "dragon-select": 300,
  portal: 500,
  "realm-enter": 500,
  "realm-return": 500,
  secret: 500,
  unlock: 700,
  ui: 100,
  "portal-change": 650,
};

const sounds = new Map<SoundName, HTMLAudioElement>();
const lastPlayed = new Map<SoundName, number>();
let masterVolume = 0.16;

function getSound(name: SoundName) {
  if (typeof window === "undefined") return null;
  const existing = sounds.get(name);
  if (existing) return existing;

  const audio = new Audio(soundFiles[name]);
  audio.preload = "auto";
  audio.addEventListener("error", () => sounds.delete(name), { once: true });
  sounds.set(name, audio);
  return audio;
}

export function setSoundVolume(volume: number) {
  masterVolume = Math.max(0, Math.min(1, volume));
  sounds.forEach((audio) => {
    audio.volume = masterVolume;
  });
}

export function playSound(name: SoundName, volume = 1) {
  const now = Date.now();
  if (now - (lastPlayed.get(name) ?? 0) < cooldowns[name]) return;
  lastPlayed.set(name, now);

  const audio = getSound(name);
  if (!audio) return;
  try {
    audio.volume = Math.max(0, Math.min(1, masterVolume * volume));
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  } catch {
    // Missing or unsupported media must never interrupt an interaction.
  }
}
