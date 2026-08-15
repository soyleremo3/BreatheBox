# BreatheBox

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-57-000020.svg?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg?logo=typescript&logoColor=white)

A narrow, local-only panic/anxiety-attack first-responder. Open the app mid-panic-attack or anxiety spike and get an instant (no login, no loading) guided box-breathing exercise or a 5-4-3-2-1 grounding sequence. No account, no backend, no AI, no data ever leaves your device.

## Why this app (evidence summary)

This project's idea was chosen through an evidence-based, multi-agent research pipeline, not a guess — see [PROJECT.md](PROJECT.md) for the full decision memo, scoring tables, and the adversarial critique that shaped the final call. Short version:

- **Market signal**: narrow, single-symptom wellness apps sustain premium pricing with strong ratings — e.g. **Rootd** (panic-attack-specific) holds 4.7–4.8★ across 10,000+ App Store ratings at prices up to $179.99 lifetime — while generalist apps in the same category carry a documented trust problem. **Calm** and **Headspace** sit at only 4.0–4.1★ on Google Play (592K–614K and 329K–340K reviews respectively) with real, quoted user complaints about paywall bait-and-switch, ads on a paid subscription, and slow load times — the last of which is a genuinely disqualifying failure mode for a panic-relief tool. Revenue figures for Calm ($210M, 2025) and Headspace ($140M, 2025) are third-party *estimates*, not audited disclosures — flagged as such throughout PROJECT.md, not presented as fact.
- **Explicit weak point, disclosed rather than hidden**: no verified revenue or download figure exists for Rootd itself, or for most other narrow-niche apps researched. This was the deciding factor's biggest caveat — the idea passed a GO/NO-GO gate on the strength of real pain-point evidence, willingness-to-pay proof at the category level, a clean ethical retention design, and a genuinely minimal MVP, not on a single audited revenue number.
- **Monetization is a hypothesis, not a proven fact.** The free tier is fully usable; a single one-time unlock is the thing being tested with real users, not something already validated.

## Features (v1 MVP)

- **Instant-launch home screen** — opens directly to one unambiguous "Start" action, no login, no onboarding, no loading spinner.
- **Guided box breathing** — animated visual + haptic pulses timed to a 4-4-4-4 second pattern, with a session timer.
- **5-4-3-2-1 grounding exercise** — a static, tap-through sensory grounding sequence.
- **Private episode log** — optionally note what triggered an episode and roughly how long it lasted; export as CSV to share with a therapist.
- **One optional daily check-in reminder** — a single local notification, opt-in only.
- **One paywall, one tier** — a single one-time unlock for unlimited log history (free tier keeps your most recent entries visible and exportable — nothing is ever deleted).

## Not in v1 (by design)

No accounts, no cloud sync, no AI features, no companion/mascot art, no analytics or ad SDKs, no social/referral mechanics, no multiple breathing patterns, no subscription tiers. See [PROJECT.md](PROJECT.md) for the full exclusion list and the reasoning behind each cut.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Expo](https://expo.dev) SDK 57 (React Native, React 19) |
| Language | TypeScript (`strict`) |
| Navigation | React Navigation v7 (native stack only, no tabs) |
| Styling | [NativeWind](https://www.nativewind.dev) v4 (Tailwind for React Native) |
| Local storage | `@react-native-async-storage/async-storage` |
| Animation | `react-native-reanimated` |
| Haptics | `expo-haptics` |
| Notifications | `expo-notifications` (local scheduled only) |
| In-app purchase | [`expo-iap`](https://github.com/hyochan/expo-iap) (direct StoreKit 2 / Play Billing, no third-party IAP backend) |
| Tests | Jest (`jest-expo` preset) |

No state-management library, no `expo-router`, no SQLite, no backend, no RevenueCat, no analytics/crash-reporting SDK — kept intentionally minimal. See [PROJECT.md](PROJECT.md) for the reasoning behind each dependency decision.

## Getting started

**Prerequisites**

- [Node.js](https://nodejs.org) 20+
- For most development: the [Expo Go](https://expo.dev/go) app on your phone

```bash
npm install
npx expo start
```

**In-app purchases require a dev client, not Expo Go.** `expo-iap` uses native store APIs that Expo Go cannot load. To test the paywall:

```bash
npx expo prebuild
npx expo run:ios      # or: npx expo run:android
```

You'll also need to create the non-consumable product `com.breathebox.app.unlock` in App Store Connect and Google Play Console before a real purchase will resolve — see `lib/constants.ts`.

## Project structure

```
App.tsx                  # navigation + EntitlementProvider wiring
index.ts                 # entry point
types.ts                 # EpisodeLogEntry / Settings / Entitlement / TriggerTag
navigation.ts             # typed React Navigation param list

lib/
  breathing.ts            # box-breathing timing engine (pure + useBreathingSession hook, unit tested)
  grounding.ts             # static 5-4-3-2-1 step content
  storage.ts                # AsyncStorage CRUD for episodes + settings
  episodes.ts                # sorting, free-tier visibility cap, CSV export (unit tested)
  notifications.ts            # the one optional daily check-in notification
  entitlement.tsx               # EntitlementProvider — wraps expo-iap's useIAP hook
  constants.ts                   # storage keys, trigger tags, product ID, crisis resources

components/               # BreathingCircle, GroundingStepCard, TriggerTagPicker, …
screens/                  # HomeScreen, BreathingScreen, GroundingScreen, LogScreen, SettingsScreen, PaywallScreen
```

## Testing

```bash
npm test        # jest — pure logic in lib/breathing.ts and lib/episodes.ts
npm run typecheck
npm run lint
npm run doctor   # expo-doctor
```

## Not medical advice

BreatheBox is a self-help tool, not a substitute for professional mental health care. The in-app Settings screen includes a visible disclaimer and a crisis-resources link (988 in the US; a generic international pointer elsewhere).

## License

[MIT](LICENSE) © Emrullah Söyler
