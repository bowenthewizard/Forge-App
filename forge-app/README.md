# FORGE — Build Yourself

Premium workout tracker for serious lifters. Dark, restrained, purposeful.

Built with Next.js 14 (App Router) + TypeScript + Tailwind CSS + Zustand.

---

## Quick start — run on your machine (5 min)

You need [Node.js 18+](https://nodejs.org) (you mentioned you already have it). Open a terminal, `cd` into this folder, then:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app is mobile-sized, so the best preview is:
- **Chrome DevTools → device mode → iPhone 14 Pro** (Cmd+Shift+M / Ctrl+Shift+M)
- Or just visit `http://localhost:3000` on your phone (same Wi-Fi; use your machine's local IP)

The app auto-reloads when you save any file. That's the iteration loop.

---

## Deploy to the internet (2 min, free)

Once you want a live URL you can share:

### Step 1 — Get the code on GitHub

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new empty repository called `forge-app` (or whatever you want). Don't add a README when creating it.
3. In your terminal, from inside this folder:

```bash
git init
git add .
git commit -m "Initial FORGE build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forge-app.git
git push -u origin main
```

Replace `YOUR_USERNAME`. GitHub will prompt for auth — use a [Personal Access Token](https://github.com/settings/tokens) as the password if prompted.

### Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
2. Click **Add New → Project** → select your `forge-app` repo → click **Deploy**.
3. Wait ~90 seconds. You'll get a URL like `forge-app-yourname.vercel.app`.

Done. Every time you `git push`, Vercel redeploys automatically in about 30 seconds.

---

## Project structure

```
forge-app/
├── app/
│   ├── layout.tsx          # Root layout, Poppins font, metadata
│   ├── page.tsx            # Main screen — switches between tabs
│   └── globals.css         # Base styles
├── components/
│   ├── StatusBar.tsx       # Fake iOS status bar
│   ├── TabBar.tsx          # Bottom nav (glass treatment)
│   ├── RestTimerMini.tsx   # Floating rest timer bar
│   └── screens/
│       ├── HomeScreen.tsx      # Greeting, today's workout, recent activity
│       ├── WorkoutScreen.tsx   # Active set logging — the 95% screen
│       ├── LibraryScreen.tsx   # Workout vault, filters, YT imports
│       └── ProfileScreen.tsx   # Stats, max lifts
├── lib/
│   ├── store.ts            # Zustand state — all app state lives here
│   └── utils.ts            # Small helpers (duration formatting)
├── tailwind.config.ts      # FORGE design tokens (colors, radii, etc.)
└── package.json
```

**The single most important file for iterating with AI:** `tailwind.config.ts`. Every color token — purple, surface, text, etc. — is defined here and used everywhere. Change a value here → it changes across the whole app.

---

## Design system recap (locked spec v2.1)

- **Deep black canvas** (`bg-bg` = `#0A0A0A`), dark surface cards (`bg-surface` = `#1A1A1A`)
- **One purple element per screen** — reserved for the primary CTA
- **Poppins** throughout, weights 400/500/600/700
- **Glass** only on floating layers (tab bar, timer mini-bar) — solid everywhere else
- **Green** = completed sets only. No other green.
- **No purple on nav tabs** — active tab is white

Full spec is inside this folder you got from Claude — `FORGE Design Language v2.1`.

---

## How to iterate with any AI (the real iteration loop)

Once the project is on GitHub, this is the loop for making it better:

1. **Open the repo in an AI-native editor**:
   - **Cursor** (recommended, free tier): [cursor.com](https://cursor.com) — feels like VS Code but with Claude built in. Open the folder, hit Cmd+L, say "change the home screen greeting to be bigger."
   - **VS Code + GitHub Copilot** also works.
   - **Claude.ai web** or **ChatGPT** — paste the relevant file, describe what you want, copy the change back.

2. **Make a change** → save → browser auto-reloads.

3. **When you like it**: `git add .`, `git commit -m "tweak home header"`, `git push`. Vercel auto-deploys in 30 sec.

4. **When something breaks**: paste the error into the AI, it'll fix it. Or revert with `git revert HEAD`.

### Good prompts for iterating

Specific and visual beats vague:
- ✅ "In `HomeScreen.tsx`, make the 'Today's Workout' card wider and add a subtle border on the left in purple."
- ❌ "Make the home screen nicer."

Reference the file and the element:
- ✅ "In `WorkoutScreen.tsx`, the set rows feel cramped. Add more vertical breathing room."
- ✅ "The `RestTimerMini` progress ring is hard to see. Make the track darker and the ring thicker."

Refer to the design spec when in doubt:
- ✅ "Per the FORGE Design Language v2.1 spec, purple should only appear on ONE element per screen. Audit `ProfileScreen.tsx` for any purple."

---

## Next steps roadmap

Rough order of what to build next (from PRD MVP):

1. **YouTube import flow** — modal with URL paste, Claude API extraction, preview/edit, save to library
2. **Exercise substitution modal** — mid-workout swap with AI suggestions
3. **Real data persistence** — swap demo data for localStorage or a backend (Supabase recommended)
4. **Onboarding** — name, goal, training frequency
5. **PR celebration** — confetti + big number when a set beats previous max
6. **Progress / analytics screen** — volume chart, frequency heatmap
7. **Auth** — NextAuth.js + email/social login
8. **Mobile wrap** — use [Capacitor](https://capacitorjs.com) to package as a real iOS/Android app

---

## Troubleshooting

**"npm install" fails**: Make sure Node.js is 18 or higher. Check with `node --version`.

**Page is blank on localhost:3000**: Check the terminal for errors. Most common: a typo in a file you edited. The error will tell you which file and line.

**Styling changes don't apply**: Tailwind scans the `content` paths in `tailwind.config.ts`. If you add a new folder of components, make sure it's included in `content`.

**Vercel build fails but local works**: 99% of the time this is a TypeScript error. Run `npx tsc --noEmit` locally to find it.

---

Built on top of the FORGE PRD and Design Language spec. Build yourself.
