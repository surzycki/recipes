# Aisle.conf Changes

## New ingredients to add

| Ingredient | Section | Entry |
|---|---|---|
| bread flour | `[grocery]` | `bread flour` |

## Matched to existing entries

| Recipe ingredient | aisle.conf match | Section |
|---|---|---|
| whole milk | `whole milk` | `[grocery]` |
| sugar | `sugar` | `[grocery]` |
| salt | `salt` | `[other]` |
| instant yeast | `yeast` | `[grocery]` |
| egg | `egg\|eggs` | `[grocery]` |
| unsalted butter | `butter` | `[grocery]` |
| milk (egg wash) | `milk` | `[grocery]` |

## Notes

- **instant yeast**: Used `yeast` from aisle.conf. "Instant" is a product variant, not a distinct ingredient.
- **unsalted butter**: Used `butter` from aisle.conf. "Unsalted" is a qualifier stripped per matching rules.
- **bread flour**: Genuinely distinct from `flour` (different protein content, not interchangeable). Added to `[grocery]`.
