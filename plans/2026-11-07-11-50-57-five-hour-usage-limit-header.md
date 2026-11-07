# Title: Plan — 5-hour usage limit and reset countdown in the app header

- Classification: feature
- Description: Track the account's 5-hour usage limit on the server, send it to every browser, and show `5h 42% · resets in 2h 13m` in the app top bar.

---

## Approach Summary / Goal

- **Data sources (both):**
  1. `rate_limit_event` messages in each session's stream. The server uses them only when `rateLimitType === 'five_hour'`.
  2. `query.usage_EXPERIMENTAL_MAY_CHANGE_DO_NOT_RELY_ON_THIS_API_YET({ skipBehaviors: true })` at each turn end. The server reads `rate_limits.five_hour`.
- **Server:** a new `UsageLimitService` keeps one account-wide value: `{ utilization, resetsAt, updatedAt }`.
  - When the value changes, `EventBusService` tells the WebSocket route.
  - The route broadcasts a new `usage_limit` event to every browser. It also sends the latest value to each new connection.
- **Web:**
  - A `useUsageLimitStore` store holds the value.
  - A pure `UsageLimitBadge` molecule shows it in `HeaderActions`, before the buttons.
  - A small `useNow(60_000)` hook re-renders it once per minute, so the countdown ticks.
- **Goal:** you always see how much of your 5-hour window is used and when it resets.

## Functional Requirements

- **Header text:** `5h 42% · resets in 2h 13m`.
  - **Hover:** shows the exact local reset time, for example `5-hour limit resets at 14:30`.
  - **Countdown:** ticks each minute. It shows `<1m` under one minute, and `reset` after the reset time passes, until new data comes.
  - **No percentage:** if the source gives no utilization, it shows `5h · resets in 2h 13m`.
  - **No reset time:** if the source gives no reset time, it shows only `5h 42%`.
- **Hidden** until the first value arrives. For example, it stays hidden after app start until a turn ends somewhere.
- **Same everywhere:** all open browser tabs show the same value, and a new tab gets the latest value at once.
- **Refresh timing:** the value updates at each turn end in any room, and whenever a `rate_limit_event` with `five_hour` arrives.
- **API key users:** when plan limits do not apply (`rate_limits_available: false`, for example an API key), the item stays hidden.

## Non-Functional Requirements

- **Experimental API:**
  - The call is wrapped in try/catch, and only one call runs at a time across the whole app.
  - If it fails or the method is missing, the last value is kept and only the error name is logged.
  - The method name sits in one place (in `UsageLimitService`), so a rename is a one-line change.
- **Time units:** `resetsAt` is stored as epoch milliseconds. The event's `resetsAt` number is treated as seconds when it is below `1e12`, because the SDK types do not give the unit. The API's ISO string is converted with `Date.parse`.
- **Conventions:**
  - One shared event per file, registered in `server-event.ts` and `index.ts`.
  - The service is a class.
  - Labels go in `ui.config.ts`.
  - The countdown helper is a `CountdownUtil` class with static methods.
- **Checks:** `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.

## Files in Scope

- **Create:**
  - `packages/shared/src/models/usage-limit.ts`
  - `packages/shared/src/events/usage-limit.ts`
  - `apps/server/src/services/usage-limit.service.ts`
  - `apps/web/src/hooks/store/useUsageLimitStore.ts`
  - `apps/web/src/hooks/feature/useNow.ts`
  - `apps/web/src/utils/countdown.util.ts`
  - `apps/web/src/components/molecules/UsageLimitBadge.tsx`
- **Modify:**
  - `packages/shared/src/models/index.ts`, `packages/shared/src/events/server-event.ts`, `packages/shared/src/events/index.ts`
  - `apps/server/src/services/event-bus.service.ts` (`onUsageLimitChanged` / `notifyUsageLimitChanged`)
  - `apps/server/src/services/session.service.ts` (handle `rate_limit_event`, refresh at turn end)
  - `apps/server/src/routes/ws.route.ts` (send on connect, broadcast on change)
  - `apps/server/src/main.ts` (wiring)
  - `apps/web/src/services/ws-client.service.ts` (handle `usage_limit`)
  - `apps/web/src/components/organisms/HeaderActions.tsx`
  - `apps/web/src/configs/ui.config.ts`
  - a web CSS file for the badge, if needed

## Risks & Assumptions

- **Risk:** the usage API is experimental. A future SDK update may rename or remove it. The `rate_limit_event` source still works then, but it may update less often.
- **Assumption:** the unit of `rate_limit_event.resetsAt` (seconds or milliseconds) is not documented. The `< 1e12` check handles both.
- **Assumption:** the value is kept only in memory. After a server restart it stays hidden until the next turn ends.
- **Testing:** the workflow is `Skip-Testing`, so there is no tester task.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute

## Task List

| # | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | DONE | Shared: add the `UsageLimit` model (`utilization: number\|null`, `resetsAt: number\|null`, `updatedAt: number`) and the `usage_limit` server event `{ type, limit }`, and register both. | developer | none | typecheck passes, and `parseServerEvent` accepts the event. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
| 2 | DONE | Server: build `UsageLimitService` (`fromRateLimitEvent`, `refresh(query)`, `current()`) and the event bus methods. Wire it into `session.service.ts` (`rate_limit_event` and turn end), `ws.route.ts` (send on connect, broadcast), and `main.ts`. | developer | task 1 | After a turn on a claude.ai plan account, every browser gets `usage_limit` with a 5h utilization and reset time. An API failure keeps the old value. API key accounts send nothing. | `guides/CLEAN_CODE/ENTRY_POINT.md`, `guides/SECURITY_SCANNER/` |
| 3 | DONE | Web: add the store, the ws-client handling, `useNow`, `CountdownUtil`, and the `UsageLimitBadge` molecule in `HeaderActions`. | developer | task 1 | Meets the Functional Requirements. It is hidden before data arrives and the countdown ticks each minute. typecheck, lint, and build pass. | `guides/CLEAN_CODE/ENTRY_POINT.md` |
