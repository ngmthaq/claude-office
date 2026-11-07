# Title: Plan — Header uses the Claude Code orange as its accent

- Classification: feature
- Description: Add a header-only stylesheet that makes the title, the bottom border, and the New session button use `#D77757`, and keep the dark background.

---

## Approach Summary / Goal

- Add a new `apps/web/src/styles/header.css`, imported in `main.tsx` like the other style files. All rules are scoped to `.app-header`, so nothing outside the header changes.
- In `.app-header`, set a local `--claude-primary: #D77757` (plus a darker hover shade, `#C2654A`). Use it for:
  - the title `h1` text color,
  - the header's bottom border (color plus 2 px width, replacing the gray `border-bottom`),
  - `.btn-primary` inside the header, by overriding Bootstrap's `--bs-btn-*` variables (bg, border, hover, active, focus ring).
- The blue `--bs-primary` stays the same everywhere else.

## Functional Requirements

- The "Claude Office" title shows in `#D77757`.
- The header has a 2 px `#D77757` bottom line.
- The New session (+) button is `#D77757` with a white icon. It gets darker (`#C2654A`) on hover and when pressed, and its focus ring is orange.
- The header background, the `connected` badge, the usage text, and the History and Archived buttons don't change.
- The Send button, the selected room, and other primary items outside the header stay blue.

## Non-Functional Requirements

- Plain CSS with Bootstrap variables, matching the other files in `src/styles/`. Lint and format checks pass.

## Files in Scope

- Create: `apps/web/src/styles/header.css`
- Modify: `apps/web/src/main.tsx` (one import line)
- Modify: `apps/web/src/components/templates/AppLayout.tsx`, only if the `border-bottom` utility class has to go so the new border can apply. Otherwise it stays untouched.

## Risks & Assumptions

- A white icon on `#D77757` has about 3:1 contrast. That meets the minimum for icons, but only just. If you want more contrast, a dark icon is the other option.
- Bootstrap's `border-bottom` utility uses `!important`. The developer may need to swap it for the new style in `AppLayout.tsx`.
- `Skip-Testing`: no tests. I'll check it by reading the diff, and you can run `/web-test`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to execute
- [ ] Blocked

## Task List

| #   | Status | Task | Responsible Role | Dependencies | Acceptance Criteria | Skills |
| --- | ------ | ---- | ---------------- | ------------ | ------------------- | ------ |
| 1   | TODO   | Create `apps/web/src/styles/header.css` with the `.app-header` rules above, and import it in `main.tsx`. If needed, replace the `border-bottom` class in `AppLayout.tsx` so the orange border applies. | developer | none | Title, bottom line, and New session button use `#D77757`, with hover/active `#C2654A` and an orange focus ring. Nothing outside the header changes. Lint and format checks pass. | `.claude/guides/CLEAN_CODE/ENTRY_POINT.md` |
