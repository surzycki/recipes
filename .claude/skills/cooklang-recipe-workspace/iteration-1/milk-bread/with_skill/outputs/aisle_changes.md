# Aisle.conf Changes for Japanese Milk Bread

## Ingredient Matching Report

| Recipe Ingredient | aisle.conf Match | Section | Action |
|---|---|---|---|
| bread flour | -- | -- | **ADD** |
| whole milk | `whole milk` | [grocery] | existing |
| sugar | `sugar` | [grocery] | existing |
| salt | `salt` | [other] | existing |
| yeast (instant) | `yeast` | [grocery] | existing |
| egg | `egg\|eggs` | [grocery] | existing |
| butter (unsalted, softened) | `butter` | [grocery] | existing |
| milk (for egg wash) | `milk` | [grocery] | existing |

## Additions Required

### [grocery]

Add the following line:

```
bread flour
```

**Rationale:** Bread flour (high-gluten, ~12-14% protein) is functionally distinct from regular `flour` (all-purpose) already in the config. It's essential for bread recipes and not interchangeable.

## Notes

- `instant yeast` mapped to existing `yeast` -- they're the same shopping item.
- `unsalted butter` mapped to existing `butter` -- same aisle item, unsalted is just a variant note.
- Temperatures converted to Celsius (175°C) as the skill prefers.
