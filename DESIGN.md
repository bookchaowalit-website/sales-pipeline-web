# Sales Pipeline — Deal Desk

## Visual world

A paper deal desk where a live opportunity is a thread, not a card. The ledger is the source of truth, the red mark is the next move, and the right-hand brief preserves context.

## System

- Palette: paper `#f0ebe1`, sheet `#fbf8ef`, ink `#171a1c`, red `#a84637`, orange `#cb7a37`, blue `#4f7480`.
- Type: Georgia for deal names and briefs; Courier New for stage, value, and workflow labels.
- Composition: stage cut → ruled deal ledger → selected deal brief.
- Signature interaction: selecting a row updates the brief; “move to next stage” advances the same record while keeping its blocker visible.
- Responsive rule: the ledger becomes a two-column reading list and the brief follows below.

## Integrity

Deal records and values are synthetic. The UI says local browser state and makes no CRM, email, or forecast claim.
