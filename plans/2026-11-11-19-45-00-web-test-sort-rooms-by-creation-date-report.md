# Title: Web Test Report — Sort rooms by creation date by default

- Classification: feature
- Description: All 8 test cases passed. The sidebar lists rooms newest first and keeps that order.
- Target URL: http://127.0.0.1:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Plan File: plans/2026-11-11-19-45-00-web-test-sort-rooms-by-creation-date.md

---

## Result Summary

| Total | Pass | Fail | Blocked | Skipped |
| ----- | ---- | ---- | ------- | ------- |
| 8     | 8    | 0    | 0       | 0       |

## Test Results

| ID    | Title | Result | Notes |
| ----- | ----- | ------ | ----- |
| TC-01 | Existing rooms are newest first | PASS | The 9 sidebar rooms matched the `rooms` table sorted by `created_at`, newest first. |
| TC-02 | A new room shows up at the top | PASS | Each new room was first right after it was made. End order: Room C, Room B, Room A. |
| TC-03 | Renaming doesn't change the order | PASS | After the rename the order was Room C, Room B, Room A renamed. |
| TC-04 | Busy and idle don't change the order | PASS | Room B showed the busy spinner and replied "OK". A watcher recorded only one order during the whole run: C, B, A renamed. |
| TC-05 | A restored room goes back to its date place | PASS | Changed during the run, with the user's OK: used Room B instead of Room A renamed (see Notes). After restore, Room B was second, below Room C. |
| TC-06 | Order stays the same after a reload | PASS | The full order was the same before and after the reload. |
| TC-07 | Order stays the same after a reconnect | PASS | The server restarted (new process). The page went connected → disconnected → connecting → connected without reloading. The remaining rooms kept the same order. |
| TC-08 | Clean up | PASS | Room A renamed and Room B are archived. Room C was no longer in the sidebar (see Notes). |

## Failures

- None.

## Blocked / Skipped

- None.

## Console and Network Problems

- No console errors were found. Console tracking started near the end of the run, so errors from earlier steps may not have been captured.

## Notes

- The dev server uses `apps/server/data`, not `~/.@ngmthaq20-claude-office` as the plan said. So the test rooms are only in the dev data.
- TC-05: Room A renamed had no Claude session (no message was sent), so it was not listed in the Archived dialog and could not be restored. With the user's OK, the test used Room B, which had a session.
- TC-07: the server restart was triggered by touching `apps/server/src/main.ts`, which made `tsx watch` restart without any code change. Room C had no Claude session, so the server did not load it again after the restart. This is existing behavior, not about ordering. Its row is still in the dev database, not archived, but it doesn't show in the app.

## Next Steps

- none
