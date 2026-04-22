# Aisle.conf Ingredient Matching Guide

## Purpose

The `config/aisle.conf` file categorizes all known ingredients by shopping aisle/section. Every ingredient in a recipe must either match an existing entry or be added to the appropriate section.

## Matching Rules

### 1. Normalize before matching
Strip these from the recipe ingredient before looking up in aisle.conf:
- Preparation words: minced, chopped, diced, sliced, crushed, grated, julienned, peeled, deveined, trimmed, ground (when describing prep, not the ingredient itself like "ground pork")
- Size qualifiers: large, small, medium, thin, thick
- Temperature: cold, warm, room temperature, frozen
- Freshness: fresh (unless part of the ingredient name like "fresh sausage")

### 2. Semantic equivalence — same ingredient, different phrasing
These are the SAME ingredient and should use the aisle.conf form:

| Recipe says | aisle.conf has | Use |
|---|---|---|
| garlic | garlic cloves | `@garlic cloves{N}` |
| clove of garlic | garlic cloves | `@garlic cloves{N}` |
| lemon juice | lemon | `@lemon{N}` (juice is prep) |
| juice of 1 lemon | lemon | `@lemon{1}` |
| lime juice | lime | `@lime{N}` |
| zest of 1 orange | orange | `@orange{1}` |
| coconut cream | coconut milk | `@coconut milk{N%unit}` (or check if distinct) |
| scallions | green onions | `@green onions{N}` |
| spring onions | green onions | `@green onions{N}` |
| coriander (herb) | cilantro | `@cilantro{}` |
| coriander seeds | corriander seeds | `@corriander seeds{N%unit}` |
| capsicum | bell pepper | `@red bell pepper{N}` (specify color) |
| aubergine | eggplant | `@eggplant{N}` |
| courgette | courgette | `@courgette{N}` (already in conf) |
| zucchini | zucchini | `@zucchini{N}` (also in conf) |
| stock/broth | check: chicken stock, beef stock, vegetable stock, chicken broth | use the matching one |
| white onion | onion | `@onion{N}` |
| yellow onion | onion | `@onion{N}` |

### 3. Plural handling
aisle.conf uses `singular|plural` format (e.g., `carrot|carrots`). Use whichever form reads naturally in the sentence:
- "Add @carrots{3}" (multiple)
- "Add @carrot{1}" (single)

### 4. When to add a NEW ingredient
Only add to aisle.conf if:
1. No existing entry covers this ingredient (not even as an alias/variant)
2. It's a genuinely distinct ingredient, not just a different cut/prep of something already listed
3. You've checked all sections — an ingredient might be in an unexpected category

### 5. Where to add new ingredients
Place in the most appropriate section:
- `[butcher]` — raw meats, poultry
- `[veggies]` — produce, fruits, vegetables
- `[fish guy]` — seafood
- `[herbs]` — fresh herbs
- `[spices]` — dried spices, spice blends
- `[grocery]` — pantry staples, dairy, baking
- `[cheese]` — cheeses
- `[alcohol]` — wines, spirits, beer
- `[indian]`, `[chinese]`, `[japanese]`, `[mexican]`, `[middle eastern]`, `[ethiopian]`, `[african]` — region-specific ingredients
- `[homemade]` — things you'd make yourself (stocks, sauces, doughs)
- `[other]` — oils, salts, condiments that don't fit elsewhere

Add with plural form if applicable: `new ingredient|new ingredients`
