# Templates section UX refinement

## Goal
Make the landing-page Templates section feel clearer and more action-driven by removing the unused selection checkmark and promoting the Preview action.

## UX rationale
- On the landing page the checkmark implies "this is the option you are buying/downloading," but the real next step is simply to preview an online resume. It adds cognitive load without helping the user decide.
- Preview should be the dominant action on each card because the product is now positioned as online-resume-first; PDF export is secondary and lives elsewhere.
- Removing the checkmark and giving Preview a button-like treatment reduces scanning friction on mobile and makes the section feel less like a settings panel and more like a gallery.

## Changes
1. In `src/components/sections/TemplatesSection.tsx` (minimal / landing view):
   - Remove the selected-state checkmark circle from template titles.
   - Keep internal selection state only if it is still needed by the modal/PDF flow; do not render it visually.
   - Convert the "Preview" link into a clear, tappable button-style action (icon + label, subtle border or filled treatment, larger touch target).
   - Move Preview to the bottom of each card so every card has a consistent, aligned CTA row.
   - Tighten title/tagline/description spacing so the card height stays compact on mobile.

2. Ensure non-minimal usage (editor/export) is not affected unless the user later asks to change it.

3. Verify mobile: cards should stack cleanly, Preview buttons align horizontally across cards, and no visual selection indicator remains.

## Success criteria
- Landing-page template cards show title, tagline, description, and a prominent Preview button.
- No checkmark or selected-state ring appears in the minimal landing view.
- Typecheck and mobile preview pass without errors.
