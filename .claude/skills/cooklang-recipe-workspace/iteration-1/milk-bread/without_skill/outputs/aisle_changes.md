# Aisle Configuration Changes

The following ingredients are used in this recipe but are not currently in `config/aisle.conf`:

## New entries needed

| Ingredient | Suggested Section | Notes |
|---|---|---|
| `bread flour` | `[grocery]` | Could also alias with `flour` but it's a distinct product |
| `instant yeast` | `[grocery]` | `yeast` exists but `instant yeast` is a more specific variant |
| `unsalted butter` | `[grocery]` | `butter` exists but `unsalted butter` is a distinct item for baking |

## Existing matches (no changes needed)

- `whole milk` -> `[grocery]`
- `sugar` -> `[grocery]`
- `salt` -> `[other]`
- `egg` -> `[grocery]`
- `milk` -> `[grocery]`
