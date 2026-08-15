# BreatheBox — project memory

Local-only Expo/React Native/TypeScript panic/anxiety first-responder app. See [README.md](README.md) for the user-facing overview.

## 1. SDK version

Built on **Expo SDK 57** (`~57.0.13` as installed; live-checked via `npm view expo dist-tags` at scaffold time — `latest: 57.0.13`). Unlike this developer's prior project (ExpiryTrack, deliberately pinned to SDK 54 for physical-device Expo Go compatibility at the time), this app was scaffolded fresh against the current `create-expo-app` default. **Revisit before upgrading further**: check what the installed Expo Go build on the actual test device supports before bumping SDK version — "npm's `latest` tag" and "what Expo Go can currently open" are two different things and have diverged before on this developer's other projects.

## 2. How this idea was chosen — market research decision trail

This app was not a guess or a clone-target pick. It came out of a structured pipeline: 6 parallel evidence-gathering research agents (each covering a different app-market vertical, using live web search, citing sources for every claim), a decision agent that scored the resulting ~11 candidate ideas across 7 dimensions, a critic/red-team agent that adversarially stress-tested the #1 pick, and an explicit GO/NO-GO checklist before any code was written. Full transparency, including where the evidence is weak, below — nothing here is presented as more certain than it is.

### Verticals researched
Habit/gamification, health/wellness micro-coaching, personal finance/utility, productivity/AI-tools, niche social/accountability, and an open-market opportunity scout (not limited to the other five categories).

### Top 3 candidates (Decision agent, 7-dimension scoring out of 70)
1. **Comfort Streak** (non-punitive companion habit tracker) — 59/70
2. **SOS** (local panic/anxiety first-responder, this app) — 57/70
3. **Digital Envelope** (cash-stuffing budgeting app) — 53/70

### The critic flipped the ranking — SOS became #1
The raw score gap between #1 and #2 was small (59 vs 57), so a critic/red-team agent re-examined both candidates adversarially rather than accepting the numeric ranking at face value. Three concrete findings drove the flip, not a re-weighting of the same facts:

1. **A broken core promise in the runner-up.** Comfort Streak's literal marketing headline was "your streak never disappears," but its specified architecture was 100% local storage with only a *user-triggered* export — meaning a lost/replaced phone without a manual backup *would* lose the streak. This is functionally the same "silent data loss on phone replacement" complaint the research documented against a real competitor (Way of Life) — the pitch and the architecture contradicted each other. SOS's core value (in-the-moment breathing/grounding) doesn't depend on persisted history at all, so no equivalent contradiction exists.
2. **A hidden non-coding bottleneck in the runner-up.** Comfort Streak's "10/10 technical simplicity" score measured code complexity correctly but missed that its real risk was *original companion character art and multi-stage animation* — a content/illustration production cost, not an engineering one. SOS needs no character art.
3. **Overstated distribution evidence in the runner-up.** Comfort Streak's distribution score leaned partly on the size of r/finch and r/habitica — competitors' own fan communities, where a rival app's promotion is typically unwelcome. SOS's evidenced channels (r/Anxiety, r/PanicAttack, r/socialanxiety) are open support communities where members openly ask for and recommend tools, a structurally cleaner distribution story.

### Evidence for SOS, with confidence labels preserved
- **Rootd** (the closest direct comp — a narrow, panic-attack-specific app): **VERIFIED** 4.7–4.8★ across 10,000+ App Store ratings, Editor's Choice, pricing up to $179.99 lifetime. **No verified revenue or download figure exists for Rootd anywhere** — this is the single weakest link in the whole case for this app, and it is disclosed here rather than hidden.
- **Calm**: revenue **$210M in 2025 is an ESTIMATE** (Business of Apps, AppMagic-sourced, not an audited company disclosure), down 24% YoY. **VERIFIED** Google Play: 4.0★, 592K–614K reviews. Real, dated, quoted user complaints: paywall bait ("You think you can access the meditations, but after you listen to day 1, you have to pay for the remainder"), ads on a paid subscription, and slow first-load times.
- **Headspace**: revenue **$140M in 2025 is an ESTIMATE**, down. **VERIFIED** Google Play: 4.0–4.1★, 329K–340K reviews. Quoted complaint: "it is sloooooooow... When I'm frustrated, stressed or overwhelmed, having the app take so long to load... defeats the purpose" — this is the exact failure mode the instant-launch requirement (§4) exists to prevent.
- **Insight Timer** (free-first alternative): **VERIFIED** 4.8–4.9★ across both stores at much larger review volume than Calm/Headspace — indirect evidence that aggressive paywalling, not content quality, drives the category's dissatisfaction gap.
- **Wysa** (AI mental-health coaching, adjacent not direct comp): **VERIFIED** pricing up to $99.99/mo for human-adjacent coaching — evidence a meaningful segment pays $100+/mo in this broad space, though not evidence for this app's specific one-time-unlock model.

### GO/NO-GO gate result: **GO**, with the weak point disclosed
5 of 6 gate criteria passed cleanly (real pain-point quotes, a genuinely minimal MVP, a real low-cost distribution channel, an ethically clean non-punitive design, and a #1 pick whose margin over #2 is explained by structural reasoning rather than just a score). The one criterion that did **not** pass cleanly: no single narrow-niche comparable app (Rootd included) has an audited/verified revenue or download figure — the evidence proves *a paying market exists in this category* (Calm/Headspace at estimated nine-figure revenue, real transacting users implied by hundreds of thousands of ratings) but not *this exact niche's* revenue at a verified level. This is true of nearly any pre-launch indie app in any vertical and was judged not to block a GO, on the condition that it's carried forward transparently — which is what this section is doing.

### What this means for the build
The monetization design in this app (§6) is built to **test a hypothesis with real users**, not to exploit an already-proven number. A single one-time unlock, a generous free tier, and no dark-pattern billing are direct, deliberate responses to the Calm/Headspace paywall-trust complaints quoted above.

## 3. Architecture

- **Navigation:** React Navigation v7, native stack only (no bottom tabs — a persistent tab bar would compete with the "one unambiguous Start action" requirement), wired by hand in `App.tsx`. No `expo-router`.
- **State:** no state-management library. Plain `useState`/`useEffect`/`useCallback` per screen, plus one Context (`EntitlementProvider`, `lib/entitlement.tsx`) because `isPro` is read from several distant screens. No theme Context — a single fixed calming palette for v1 (a light/dark flip mid-panic-episode would work against the app's purpose).
- **Storage:** `@react-native-async-storage/async-storage`, three JSON keys (`breathebox.episodes`, `breathebox.settings`, `breathebox.entitlement`) via `lib/storage.ts`. No SQLite (the data is small and non-relational — see the architecture-planning agent's reasoning, preserved verbatim in git history of this file's first commit), no backend, no account.
- **Styling:** NativeWind v4, same pattern as ExpiryTrack, minus the CSS-variable theme-switching machinery (no dark mode in v1).
- **Deliberately excluded:** `@expo/vector-icons` (avoids font-loading risk to instant launch — nav affordances use plain text/shapes instead), `expo-file-system`/`expo-sharing` (CSV export uses core RN `Share.share()` instead), `@react-native-community/datetimepicker` (episode duration uses preset tap-chips, not a picker), any state-management/analytics/crash-reporting/ad/AI SDK.

## 4. Instant launch

The single non-negotiable technical requirement, directly answering the Headspace complaint quoted in §2. `HomeScreen` is the initial route and renders synchronously: no font loading, no manual `expo-splash-screen` hold-open, no blocking `AsyncStorage` read gates its Start button. Screens that need stored data (`Log`, `Settings`, `Paywall`) read it in their own `useEffect` after mount, with safe synchronous defaults meanwhile (empty list, `isPro: false`). `EntitlementProvider` initializes with `isPro: false` synchronously and hydrates in the background; `HomeScreen` never subscribes to it.

## 5. Episode log & the free-tier cap

`FREE_TIER_VISIBLE_ENTRIES` (`lib/constants.ts`) caps **visibility and export only** — every entry a user logs is always saved to `AsyncStorage` via `addEpisode`. `visibleEpisodes()` (`lib/episodes.ts`) is a pure slicing function the UI calls to decide what to *show*; it never deletes anything. This was an explicit interpretation call flagged during architecture planning: destroying a user's mental-health-adjacent personal data as a monetization lever would directly contradict the app's trust positioning ("share with your therapist," not "pay us or lose your history").

## 6. Breathing engine & IAP/paywall

- **Breathing timing** (`lib/breathing.ts`): pure `getPhaseAtElapsed`/`formatElapsed` functions, unit tested in `breathing.test.ts`, drive both the discrete `useBreathingSession()` hook (one `setTimeout` per phase boundary — 4 per 16s cycle, not a polling interval — each firing one haptic pulse) and `BreathingCircle`'s Reanimated visual loop. Both clocks read `BOX_BREATHING_PATTERN` as their single source of truth so they can't drift apart even on separate threads.
- **IAP**: [`expo-iap`](https://github.com/hyochan/expo-iap), not RevenueCat. With only one product and one tier, RevenueCat's cross-device sync/multi-product tooling solves problems this app doesn't have, at the cost of an extra third-party account and service receiving purchase-adjacent data — a real cost for a privacy-positioned, mental-health-adjacent app. Entitlement is derived directly from the store (`useIAP` hook) and mirrored into `AsyncStorage` for an instant answer on next launch; there is no server-side receipt validation (accepted trade-off of the no-backend constraint).
- **One-time non-consumable unlock, not a subscription** — explicit, reasoned call: simpler entitlement model, no renewal/grace-period state machine, and a recurring charge for a small content unlock is both a harder sell and a worse trust signal for a calm utility than a modest one-time price. `PRODUCT_ID_UNLOCK` (`lib/constants.ts`) must be created as a real non-consumable product in App Store Connect and Google Play Console — this repo builds the integration point, not the live product.
- **Restore Purchases** is present (Settings, Paywall) though not explicitly in the original locked MVP scope — required by App Store guidelines for any non-consumable purchase, so treated as a compliance necessity of the paywall rather than new feature scope.
- **`expo-iap` does not run in Expo Go.** Testing real purchases requires `npx expo prebuild` + a dev client (`expo run:ios` / `expo run:android`) — a genuine departure from a pure Expo-Go workflow, intrinsic to shipping any real IAP.

## 7. What's explicitly out of scope for v1 (and why)

- Additional breathing patterns, voice-guided/recorded audio narration, any companion/character/mascot visuals or animation — all real "nice to haves" that would blow a solo dev's timeline (see §2's critique of the runner-up idea for why "hidden art-production cost" specifically was worth taking seriously) without being needed to test this app's core hypothesis.
- Any account system, cloud sync, or cross-device backup — the local-only architecture is a deliberate privacy/trust choice for a mental-health-adjacent app, not a placeholder for a future backend.
- Any AI/LLM feature, any social/sharing/referral mechanic, charts/analytics/trends on the episode log (a plain list is sufficient to test the log's usefulness), localized crisis-resource databases beyond a US number + one generic international fallback, watch app/widget/Live Activity integrations, a second monetization tier or introductory-trial billing complexity.

## 8. Screens

| Screen | Status |
|---|---|
| `HomeScreen` | Done — instant-launch, one Start action, secondary grounding link, footer nav |
| `BreathingScreen` | Done — box-breathing animation, timer, haptics, always-visible close control |
| `GroundingScreen` | Done — static 5-4-3-2-1 tap-through sequence |
| `LogScreen` | Done — quick-add, list, free-tier visibility cap, CSV export |
| `SettingsScreen` | Done — daily check-in toggle, unlock/restore, disclaimer + crisis link |
| `PaywallScreen` | Done — single tier, single price, restore |

## 9. Regulatory note

Health & Fitness-category content review applies: the Settings screen carries a visible "not a substitute for professional care" disclaimer and a crisis-resources link (988 US + generic international fallback). No analytics or ad SDK is bundled, consistent with the local-only architecture and this app's privacy positioning — this was an explicit constraint carried through from the original market research, not an afterthought.
