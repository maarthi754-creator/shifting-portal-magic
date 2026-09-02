export type ElementKey = "fire" | "ice" | "shadow" | "storm" | "void";

export interface Dragon {
  id: string;
  name: string;
  element: ElementKey;
  glyph: string;
  tagline: string;
  description: string;
  ability: string;
  realms: string[];
  secret?: boolean;
}

export interface Realm {
  id: string;
  name: string;
  element: ElementKey;
  glyph: string;
  blurb: string;
  lore: string;
  danger: string;
  /** realms banished from the map after visiting this one */
  banishes?: string[];
  /** realms that manifest after visiting this one */
  spawns?: string[];
  omen: string;
  hidden?: boolean;
}

export const DRAGONS: Dragon[] = [
  {
    id: "fire",
    name: "Pyrrhax",
    element: "fire",
    glyph: "🔥",
    tagline: "The Ember Sovereign",
    description:
      "Born in a collapsing volcano, Pyrrhax breathes molten light and remembers every path burned behind it.",
    ability: "Molten Wake — scorches a realm shut the moment you leave it.",
    realms: ["inferno-peaks", "ember-valley", "lava-caverns"],
  },
  {
    id: "ice",
    name: "Vandrel",
    element: "ice",
    glyph: "❄️",
    tagline: "The Silent Frost",
    description:
      "A drifting glacier with wings. Vandrel freezes time in the realms it touches, preserving what should be forgotten.",
    ability: "Glass Breath — freezes a realm's layout, revealing what was hidden beneath.",
    realms: ["frozen-kingdom", "crystal-glacier", "northern-storm"],
  },
  {
    id: "shadow",
    name: "Nyxaris",
    element: "shadow",
    glyph: "🌑",
    tagline: "The Unseen Coil",
    description:
      "Nyxaris does not fly — it is simply already there. Riders report arriving at realms they never chose.",
    ability: "Umbral Drift — reveals realms that other riders can never see.",
    realms: ["shadow-forest", "lost-realm", "hidden-void"],
  },
  {
    id: "storm",
    name: "Thalvex",
    element: "storm",
    glyph: "⚡",
    tagline: "The Thunder Crown",
    description:
      "A living squall. Thalvex rewrites the sky map each time it beats its wings, so no route is ever the same twice.",
    ability: "Static Rewrite — rearranges the portal map on every return.",
    realms: ["thunder-isles", "sky-kingdom", "storm-citadel"],
  },
  {
    id: "void",
    name: "Ourovex",
    element: "void",
    glyph: "🜂",
    tagline: "The Dragon That Should Not Exist",
    description:
      "Unlocked only by riders who read the sigils in the correct order. The portal denies its existence.",
    ability: "Paradox Flight — every realm becomes reachable, and none of them stay.",
    realms: ["hidden-void", "lost-realm", "ashen-realm", "whispering-nexus"],
    secret: true,
  },
];

export const REALMS: Realm[] = [
  {
    id: "inferno-peaks",
    name: "Inferno Peaks",
    element: "fire",
    glyph: "🌋",
    blurb: "Spires of black glass venting molten breath.",
    lore: "The peaks scream in a language of pressure. Riders who linger begin to hum along.",
    danger: "Extreme",
    banishes: ["frozen-kingdom", "crystal-glacier"],
    spawns: ["ashen-realm"],
    omen: "The cold realms have burned away. Something ashen took their place.",
  },
  {
    id: "ember-valley",
    name: "Ember Valley",
    element: "fire",
    glyph: "🔥",
    blurb: "A slow-burning meadow where sparks nest like fireflies.",
    lore: "Every ember here is a memory of a realm that no longer exists. Do not step on them.",
    danger: "Moderate",
    spawns: ["cinder-archive"],
    omen: "An archive of burned realms has opened itself to you.",
  },
  {
    id: "lava-caverns",
    name: "Lava Caverns",
    element: "fire",
    glyph: "🕯️",
    blurb: "Tunnels that rearrange when unobserved.",
    lore: "Cartographers mapped it eleven times. Eleven different maps.",
    danger: "High",
    banishes: ["ember-valley"],
    spawns: ["obsidian-throat"],
    omen: "Ember Valley collapsed behind you. The Obsidian Throat inhaled.",
  },
  {
    id: "frozen-kingdom",
    name: "Frozen Kingdom",
    element: "ice",
    glyph: "🏔️",
    blurb: "A court of kings frozen mid-argument.",
    lore: "They are still arguing. Very slowly. One word per century.",
    danger: "Moderate",
    banishes: ["inferno-peaks"],
    spawns: ["glass-sea"],
    omen: "The Inferno Peaks froze solid. A sea of glass appeared where they stood.",
  },
  {
    id: "crystal-glacier",
    name: "Crystal Glacier",
    element: "ice",
    glyph: "💎",
    blurb: "Light bends here — so do decisions.",
    lore: "Your reflection arrives a half-second before you do.",
    danger: "Low",
    spawns: ["mirror-hollow"],
    omen: "Your reflection wandered off and built a realm of its own.",
  },
  {
    id: "northern-storm",
    name: "Northern Storm",
    element: "ice",
    glyph: "🌨️",
    blurb: "A blizzard with intent.",
    lore: "It follows riders home. Check behind you occasionally.",
    danger: "High",
    banishes: ["crystal-glacier"],
    spawns: ["frostwake"],
    omen: "The glacier shattered. Frostwake drifts in its debris.",
  },
  {
    id: "shadow-forest",
    name: "Shadow Forest",
    element: "shadow",
    glyph: "🌲",
    blurb: "Trees that grow downward into something.",
    lore: "The canopy is beneath you. Try not to think about what the roots reach.",
    danger: "High",
    banishes: ["sky-kingdom"],
    spawns: ["lantern-grave"],
    omen: "The Sky Kingdom went dark. Lanterns lit a grave instead.",
  },
  {
    id: "lost-realm",
    name: "The Lost Realm",
    element: "shadow",
    glyph: "🕳️",
    blurb: "It was never on any map. It insists it always was.",
    lore: "You have been here before. The portal has the receipts.",
    danger: "Unknown",
    spawns: ["hidden-void"],
    omen: "Something opened beneath the map. The Void noticed you.",
  },
  {
    id: "hidden-void",
    name: "Hidden Void",
    element: "shadow",
    glyph: "⚫",
    blurb: "Absence, arranged into architecture.",
    lore: "There is nothing here, and it is extremely well organized.",
    danger: "Fatal",
    banishes: ["shadow-forest", "lantern-grave"],
    spawns: ["whispering-nexus"],
    omen: "The forest was unwritten. A Nexus whispers in its absence.",
  },
  {
    id: "thunder-isles",
    name: "Thunder Isles",
    element: "storm",
    glyph: "🏝️",
    blurb: "Islands that levitate on their own noise.",
    lore: "Silence would drop them. Nobody dares whisper.",
    danger: "Moderate",
    spawns: ["static-reef"],
    omen: "The noise spilled over. A reef of pure static formed.",
  },
  {
    id: "sky-kingdom",
    name: "Sky Kingdom",
    element: "storm",
    glyph: "🏰",
    blurb: "A citadel stitched to cloud with lightning thread.",
    lore: "The throne is empty and has been advertising for a rider.",
    danger: "Low",
    banishes: ["thunder-isles"],
    spawns: ["cloudspire"],
    omen: "The Isles fell silent and sank. A Cloudspire rose in protest.",
  },
  {
    id: "storm-citadel",
    name: "Storm Citadel",
    element: "storm",
    glyph: "⚡",
    blurb: "Where the weather is kept in cages.",
    lore: "Two cages are open. Nobody will say which.",
    danger: "Extreme",
    banishes: ["cloudspire"],
    spawns: ["eye-of-thalvex"],
    omen: "A cage opened. The Eye of Thalvex is watching the map now.",
  },
  // ── spawned / reactive realms ──────────────────────────────
  {
    id: "ashen-realm",
    name: "Ashen Realm",
    element: "fire",
    glyph: "🜃",
    blurb: "The grey afterthought of every burned world.",
    lore: "Ash remembers shape. Step carefully and you'll recognise the streets.",
    danger: "High",
    spawns: ["whispering-nexus"],
    omen: "Ash rearranged itself into a word you almost recognise.",
    hidden: true,
  },
  {
    id: "cinder-archive",
    name: "Cinder Archive",
    element: "fire",
    glyph: "📜",
    blurb: "Every realm you erased, catalogued neatly.",
    lore: "Your name appears in the index. Twice.",
    danger: "Low",
    omen: "The archive updated itself while you read it.",
    hidden: true,
  },
  {
    id: "obsidian-throat",
    name: "Obsidian Throat",
    element: "fire",
    glyph: "🕳️",
    blurb: "A tunnel that swallows routes.",
    lore: "It is not a cave. It is a decision being digested.",
    danger: "Fatal",
    banishes: ["lava-caverns"],
    omen: "The caverns are gone. They were never yours to keep.",
    hidden: true,
  },
  {
    id: "glass-sea",
    name: "Glass Sea",
    element: "ice",
    glyph: "🪞",
    blurb: "Frozen waves mid-collapse.",
    lore: "Skate across and you will hear the tide arguing underneath.",
    danger: "Moderate",
    omen: "The sea cracked in the shape of your route.",
    hidden: true,
  },
  {
    id: "mirror-hollow",
    name: "Mirror Hollow",
    element: "ice",
    glyph: "🔮",
    blurb: "Built by your own reflection, badly.",
    lore: "The proportions are slightly wrong, as if remembered rather than seen.",
    danger: "Low",
    spawns: ["whispering-nexus"],
    omen: "Your reflection left a door open.",
    hidden: true,
  },
  {
    id: "frostwake",
    name: "Frostwake",
    element: "ice",
    glyph: "❄",
    blurb: "The trail a glacier leaves when it flees.",
    lore: "Something scared it. That something is still ahead of you.",
    danger: "High",
    omen: "Frostwake is moving. Away from you.",
    hidden: true,
  },
  {
    id: "lantern-grave",
    name: "Lantern Grave",
    element: "shadow",
    glyph: "🏮",
    blurb: "Where lost riders hung their last light.",
    lore: "Count the lanterns. The number changes when you look away.",
    danger: "High",
    omen: "One lantern went out as you arrived.",
    hidden: true,
  },
  {
    id: "static-reef",
    name: "Static Reef",
    element: "storm",
    glyph: "🌐",
    blurb: "Coral grown from interference.",
    lore: "Touch it and you'll hear your own future footsteps.",
    danger: "Moderate",
    omen: "The reef repeated something you haven't said yet.",
    hidden: true,
  },
  {
    id: "cloudspire",
    name: "Cloudspire",
    element: "storm",
    glyph: "☁️",
    blurb: "A tower of weather, held by habit.",
    lore: "It has been falling for four hundred years. Politely.",
    danger: "Low",
    omen: "The spire leaned toward your next destination.",
    hidden: true,
  },
  {
    id: "eye-of-thalvex",
    name: "Eye of Thalvex",
    element: "storm",
    glyph: "👁️",
    blurb: "The storm, looking back.",
    lore: "It blinks when you make a choice you regret.",
    danger: "Extreme",
    spawns: ["whispering-nexus"],
    omen: "It blinked. You know why.",
    hidden: true,
  },
  {
    id: "whispering-nexus",
    name: "Whispering Nexus",
    element: "void",
    glyph: "✶",
    blurb: "The place the portal goes when it is not watching you.",
    lore: "Here the portal admits it has been editing your journey the whole time.",
    danger: "Unknown",
    omen: "The portal has stopped pretending.",
    hidden: true,
  },
  {
    id: "the-in-between",
    name: "The In-Between",
    element: "void",
    glyph: "◈",
    blurb: "A dimension folded out of your own backtracking.",
    lore: "This realm is made of the routes you didn't take. It is very crowded.",
    danger: "Fatal",
    omen: "You folded the map. The map folded back.",
    hidden: true,
  },
];

export const REALM_MAP: Record<string, Realm> = Object.fromEntries(
  REALMS.map((r) => [r.id, r]),
);

export const DRAGON_MAP: Record<string, Dragon> = Object.fromEntries(
  DRAGONS.map((d) => [d.id, d]),
);

export interface Secret {
  id: string;
  title: string;
  hint: string;
  reveal: string;
}

export const SECRETS: Secret[] = [
  {
    id: "rune-vigil",
    title: "The Patient Rune",
    hint: "Something glows where nothing should. It rewards stillness.",
    reveal: "Whispering Nexus has been etched into your map.",
  },
  {
    id: "sigil-sequence",
    title: "The Correct Order",
    hint: "Three sigils. One order. The portal is not going to tell you.",
    reveal: "Ourovex — the dragon the portal denies — answers your call.",
  },
  {
    id: "fold",
    title: "The Fold",
    hint: "Return often enough and the portal loses its composure.",
    reveal: "The In-Between has unfolded from your own hesitation.",
  },
  {
    id: "egg",
    title: "The Unhatched",
    hint: "An egg is not an object. It is a question.",
    reveal: "The egg told you what the portal is really doing.",
  },
];

export const PORTAL_TAUNTS = [
  "Are you sure you want to go there?",
  "You were here before... weren't you?",
  "That realm no longer exists.",
  "The portal remembers.",
  "Curiosity has consequences.",
  "I moved something. Find it.",
  "You are being predictable, rider.",
  "One of these destinations is lying.",
  "I liked the last route better.",
  "Do not trust the glowing one.",
];
