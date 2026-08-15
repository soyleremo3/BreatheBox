# BreatheBox

Full project context (architecture, market-research decision trail, session log) lives in [PROJECT.md](PROJECT.md) — read it before making non-trivial changes.

## Hard rules

- Local-only. No backend, no account, no analytics/crash-reporting SDK, nothing leaves the device except what the OS-level store purchase flow requires.
- No state-management library — plain hooks plus the one `EntitlementProvider` Context.
- No `expo-router` — React Navigation, wired by hand in `App.tsx`.
- Notifications are local-scheduled only — no push token, no FCM/APNs, no backend. There is exactly one notification (the daily check-in) — don't add more without updating PROJECT.md's reasoning.
- Home screen must render synchronously with zero blocking data reads — instant launch is this app's single non-negotiable requirement (see PROJECT.md §2). Never gate the Home route's first paint on AsyncStorage, fonts, or the IAP connection.
- Free-tier log cap gates *visibility/export only* — never delete or refuse to save a user's episode entry. See PROJECT.md §5.
- No character/mascot art, no additional breathing patterns, no second monetization tier, no AI features — out of scope by design for v1, not deferred work. See PROJECT.md §7 for the full exclusion list and why.
