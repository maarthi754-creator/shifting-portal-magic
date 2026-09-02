# Whispering Realms Portal

You are an elite award-winning Frontend Developer, Creative UI/UX Designer, Interactive Web Experience Designer, and JavaScript Animation Expert.

Your task is to design and develop a COMPLETE, visually stunning, highly interactive frontend website for a competition.

# 🐉 PROJECT TITLE

THE DRAGON PORTAL THAT CHANGES ITS MIND

# 🎯 CORE PROBLEM STATEMENT

The user is a Dragon Rider exploring hidden realms beyond Berk through a mysterious magical portal.

The portal is NOT static.

The entire world dynamically reacts and changes based on the user's actions.

The user should feel like they are exploring a living magical universe where their choices have consequences.

Users must be able to:

🐉 Explore different dragons and locations

🗺️ Navigate between multiple magical realms

🔓 Unlock hidden areas

👀 Discover secret interactions

✨ Experience a portal and interface that changes based on their behavior

# 😈 MOST IMPORTANT REQUIREMENT

The portal must CHANGE ITS BEHAVIOR depending on what the user does.

Implement interactive consequences such as:

1. Selecting a specific dragon changes the destinations available inside the portal.

Example:

* Selecting a Fire Dragon unlocks volcanic and lava realms.

* Selecting an Ice Dragon unlocks frozen realms.

* Selecting a Shadow Dragon reveals dark or hidden realms.

2. Visiting one realm changes the portal world.

Example:

* After visiting Realm A, Realm B disappears.

* A new secret realm appears.

* Portal colors and effects change.

* Available dragons or destinations change.

3. Returning to a previously visited realm must NOT show exactly the same page.

The layout should dynamically change.

Examples:

* Elements move to different positions.

* Some locations disappear.

* New objects appear.

* The portal changes color or personality.

* Different messages appear.

* Navigation paths change.

4. Hovering over mysterious objects should reveal hidden interactions.

Examples:

* Hovering over a floating rune reveals a secret realm.

* Hovering over a dragon egg unlocks hidden information.

* Hovering over clouds reveals a hidden portal.

* Some objects should intentionally look mysterious and encourage exploration.

# 🧠 MAIN EXPERIENCE GOAL

This should NOT feel like a normal multi-page website.

It should feel like an interactive magical game experience.

The user should constantly think:

"Wait... this was not here before."

"Why did that realm disappear?"

"Did my previous choice change something?"

"There must be a secret hidden somewhere."

The website should reward curiosity and exploration.

# 🎨 VISUAL DESIGN REQUIREMENTS

Create a premium, cinematic, fantasy-inspired interface.

Design style:

* Dark mystical fantasy world

* Cinematic atmosphere

* Magical glowing effects

* Animated particles

* Floating objects

* Fog and clouds

* Fire and ice effects

* Smooth transitions

* Glassmorphism UI where appropriate

* Rich gradients

* Dramatic lighting

* Premium game-like interface

The UI should feel inspired by a high-quality fantasy adventure game, NOT like a basic student project.

IMPORTANT:

Avoid making the interface look cluttered.

Maintain:

* Clear visual hierarchy

* Smooth user flow

* Responsive layout

* Consistent design language

* Readable typography

# 🌌 REQUIRED USER JOURNEY

## SCREEN 1 — CINEMATIC LANDING EXPERIENCE

Create a powerful full-screen landing page.

Show:

* A mysterious animated portal

* Floating particles

* Moving clouds or fog

* Cinematic background

* A mysterious message

Example concept:

"THE REALMS ARE SHIFTING..."

Include a dramatic button:

ENTER THE PORTAL

The portal should have subtle animation and react when hovered.

Clicking ENTER THE PORTAL should create a cinematic transition into the experience.

---

## SCREEN 2 — CHOOSE YOUR DRAGON

Display multiple dragons with unique personalities and abilities.

Suggested dragons:

🔥 Fire Dragon

❄️ Ice Dragon

🌑 Shadow Dragon

⚡ Storm Dragon

Each dragon should have:

* Name

* Element

* Short description

* Unique ability

* Animated visual card

IMPORTANT:

Selecting a dragon must permanently influence the next part of the experience.

For example:

Fire Dragon:

Available realms:

* Inferno Peaks

* Ember Valley

* Lava Caverns

Ice Dragon:

Available realms:

* Frozen Kingdom

* Crystal Glacier

* Northern Storm

Shadow Dragon:

Available realms:

* Shadow Forest

* Lost Realm

* Hidden Void

Storm Dragon:

Available realms:

* Thunder Isles

* Sky Kingdom

* Storm Citadel

The selected dragon must be stored in application state.

---

## SCREEN 3 — THE LIVING PORTAL MAP

Create the MAIN EXPERIENCE.

Show a magical portal surrounded by multiple realm destinations.

The portal map should feel alive.

Include:

🌀 Central animated portal

🗺️ Multiple floating realm destinations

✨ Animated magical paths

🔒 Locked destinations

👁️ Hidden destinations

🐉 Dragon companion information

The available realms MUST dynamically depend on the selected dragon.

This is the heart of the project.

---

# 🔄 DYNAMIC PORTAL SYSTEM

Implement a system that tracks user actions.

Track:

* Selected dragon

* Visited realms

* Unlocked secrets

* Hidden interactions discovered

* Current portal state

Based on these actions, dynamically change:

* Available destinations

* Portal color

* Portal animation

* Realm visibility

* Navigation options

* Layout positions

* Messages

Example logic:

IF user visits "Inferno Peaks":

THEN:

* "Frozen Kingdom" disappears

* "Ashen Realm" appears

* Portal becomes red/orange

* A mysterious warning appears

IF user returns to the main portal:

THEN:

* Destination positions are rearranged

* One realm is missing

* A previously locked realm becomes visible

The user should understand that their actions have consequences.

---

# 🔓 HIDDEN SECRET SYSTEM

Add multiple secret interactions.

Do NOT clearly tell the user where everything is.

Include at least 3 hidden secrets.

Examples:

SECRET 1:

Hover over a mysterious glowing rune for 2 seconds.

Result:

A hidden realm appears.

---

SECRET 2:

Click objects in a specific sequence.

Result:

A secret dragon is unlocked.

---

SECRET 3:

Return to the portal after visiting two specific realms.

Result:

The portal behaves strangely and reveals a hidden dimension.

Make discovery feel rewarding.

Show an exciting animation when a secret is discovered.

Example:

✨ SECRET REALM DISCOVERED ✨

---

# 😈 THE "ANNOYING PORTAL" PERSONALITY

The portal should occasionally behave unexpectedly.

Examples:

* Move a destination slightly when the user tries to click it.

* Change its message.

* Pretend a realm is available and then disappear.

* Change colors unexpectedly.

* Display mysterious messages.

Example messages:

"Are you sure you want to go there?"

"You were here before... weren't you?"

"That realm no longer exists."

"The portal remembers."

"Curiosity has consequences."

Do NOT make this frustrating enough to break the user experience.

It should feel playful, mysterious, and clever.

---

# ✨ WOW FACTOR FEATURES

Include visually impressive frontend-only features such as:

1. Animated portal using CSS and JavaScript

2. Floating particles

3. Dynamic glowing effects

4. Smooth page transitions

5. Realm cards that react to hover

6. Mouse-following magical light effect

7. Parallax background movement

8. Animated paths between realms

9. Dynamic rearrangement of destinations

10. Secret hover interactions

11. Unlock animations

12. Cinematic loading transitions

13. Sound toggle button

    (Use placeholder/mock sound functionality if necessary)

14. Progress system showing:

REALMS DISCOVERED: X / TOTAL

SECRETS FOUND: X / TOTAL

---

# 🛠️ TECHNICAL REQUIREMENTS

Use:

* React

* Vite

* JavaScript

* Tailwind CSS

You may also use:

* Framer Motion for animations

* Lucide React for icons

Do NOT require a backend.

Everything should work using frontend state management.

Use:

* React useState

* React Context if needed

* LocalStorage to preserve important user choices

The application should work completely as a frontend prototype.

---

# 📱 RESPONSIVENESS

The website must work properly on:

* Desktop

* Laptop

* Tablet

* Mobile

However, prioritize an AMAZING desktop experience because this will be demonstrated in a competition.

---

# 📂 PROJECT STRUCTURE

Create a clean and understandable folder structure.

Example:

src/

components/

* Portal.jsx

* DragonCard.jsx

* RealmCard.jsx

* SecretObject.jsx

* ParticleBackground.jsx

pages/

* Landing.jsx

* DragonSelection.jsx

* PortalWorld.jsx

* Realm.jsx

data/

* dragons.js

* realms.js

* secrets.js

App.jsx

main.jsx

Keep the code modular and easy to modify during the competition.

---

# ⚠️ IMPORTANT DEVELOPMENT RULES

DO NOT create a basic static website.

DO NOT create simple cards with no interaction.

DO NOT make every realm permanently visible.

DO NOT make the portal behavior random without connecting it to user actions.

The changes MUST feel connected to what the user previously did.

The website should demonstrate the exact concept:

"THE PORTAL CHANGES ITS MIND."

Every important interaction should create a visible consequence.

---

# 🏆 COMPETITION WINNING PRIORITIES

Prioritize in this order:

1. WOW VISUAL IMPACT

2. UNIQUE INTERACTIONS

3. CLEAR DEMONSTRATION OF THE PROBLEM STATEMENT

4. SMOOTH USER EXPERIENCE

5. CREATIVE DYNAMIC BEHAVIOR

6. CLEAN CODE

7. RESPONSIVE DESIGN

Think like a competition judge.

Within the first 10 seconds, the website should look visually impressive.

Within the first minute, the judge should clearly understand:

"This portal actually changes based on what the user does."

# 🚀 FINAL INSTRUCTION

First, provide:

1. The complete UI/UX concept

2. User flow

3. Dynamic interaction logic

4. Component architecture

5. Design system

6. List of secrets and hidden interactions

Then develop the COMPLETE frontend.

Make reasonable creative decisions without asking unnecessary questions.

The final result should feel like a polished, cinematic, interactive fantasy web experience that could realistically WIN a frontend competition.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://shifting-portal-magic.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5e58392d-c6f8-4c9c-afb4-dec18bb45433).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
