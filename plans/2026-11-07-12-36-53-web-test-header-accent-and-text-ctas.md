# Title: Web Test Plan — Header orange accent and text CTAs in modals and cards

- Classification: feature
- Description: Check the orange header accent, and that modal and card CTAs show as text buttons instead of icon buttons.
- Target URL: http://localhost:5173
- Environment: local
- Browser Tool: Claude in Chrome
- Screen Sizes: desktop (current window)

---

## Goal

- Prove the header title, the bottom line, and the New session (+) button use `#D77757`, and that blue items outside the header stay blue.
- Prove the New session, History, Archived, and Remove-confirm dialogs, and the permission card, show text buttons with the right labels and colors.

## Scope

- In scope: the header; the New session, History, Archived, and Remove-confirm dialogs; the permission card.
- Out of scope: clicking any CTA that changes data (Remove, Restore, Resume, Allow, Deny, Start session here). The Close and Archive confirm dialogs only show while Claude is working, and they use the same component as Remove, so I'll check Remove only.

## Preconditions

- The app runs at http://localhost:5173. I'll refresh the page to load the latest code.
- The "Parallel file listing…" room may still have the pending permission request from the last run. If it doesn't, TC-07 is `Blocked`.

## Risks & Assumptions

- No data changes: I only open dialogs and close them with **Cancel** or the corner ✕.
- History and Archived may be empty. If one is empty, I can't check its row buttons, and that case is `Blocked`.

## Open Questions / Blockers

- None.

## Status

- [x] Ready to run
- [ ] Blocked

## Test Cases

| ID    | Status | Title | Priority | Preconditions | Steps | Test Data | Expected Result |
| ----- | ------ | ----- | -------- | ------------- | ----- | --------- | --------------- |
| TC-01 | PASS | Header uses the orange accent | high | App open | 1. Refresh the page. 2. Zoom in on the header. 3. Read the computed colors of the title, the header's bottom border, and the + button. | none | Title `rgb(215, 119, 87)`, a 2 px orange bottom border, and an orange + button with a white icon. |
| TC-02 | PASS | Blue stays outside the header | medium | TC-01 | 1. Select a room. 2. Read the Send button's background color. | none | The Send button is still Bootstrap blue, not orange. |
| TC-03 | PASS | New session dialog uses text buttons | high | App open | 1. Click **+**. 2. Screenshot the footer. 3. Click **Cancel**. | none | The footer shows the text buttons **Cancel** and **Start session here** (blue), with no icons. Cancel closes the dialog. |
| TC-04 | PASS | History rows use text buttons | high | App open | 1. Click the **History** button. 2. Screenshot the list. 3. Close with ✕. | none | Each row shows a text **Open** or **Resume** button, with no icons. |
| TC-05 | BLOCKED | Archived rows use text buttons | medium | App open | 1. Click the **Archived** button. 2. Screenshot. 3. Close with ✕. | none | Each row shows a text **Restore** button. If the list is empty, the case is `Blocked`. |
| TC-06 | PASS | Remove confirm uses text buttons | high | App open | 1. Open a room's **…** menu. 2. Click **Remove**. 3. Screenshot the dialog. 4. Click **Cancel**. | none | The footer shows **Cancel** and a red **Remove** text button. Cancel closes it, and the room is still there. |
| TC-07 | BLOCKED | Permission card uses text buttons | medium | A pending permission exists | 1. Select the "Parallel file listing…" room. 2. Scroll to the pending permission card. 3. Screenshot it. | none | The card shows a red outline **Deny** and a green **Allow** text button. Neither is clicked. |
