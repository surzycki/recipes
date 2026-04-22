# Aisle.conf Changes for Beef Bourguignon

## Ingredients matched to existing entries

| Recipe ingredient | aisle.conf entry | Section |
|---|---|---|
| beef chuck | `beef` | [butcher] |
| salt | `salt` | [other] |
| pepper | `black pepper` | [spices] |
| oil | `oil` | [other] |
| carrots | `carrot\|carrots` | [veggies] |
| celery | `celery` | [veggies] |
| onion | `onion\|onions` | [veggies] |
| garlic cloves | `garlic clove\|garlic cloves` | [veggies] |
| red wine | `red wine` | [alcohol] |
| beef stock | `beef stock` | [grocery] |
| thyme | `thyme` | [herbs] |
| bay leaves | `bay leaves` | [spices] |
| parsley stems | `parsely` | [herbs] (matched to existing misspelling) |
| tomato paste | `tomato paste` | [grocery] |
| pearl onions | `pearl onions` | [veggies] |
| cremini mushrooms | `cremini mushroom\|cremini mushrooms` | [veggies] |
| butter | `butter` | [grocery] |

## New entries to add

| Ingredient | Section | Entry |
|---|---|---|
| lardons | [butcher] | `lardons` |

## Notes

- **parsley**: The config has `parsely` (misspelled). Used `@parsely{3%stems}` to match the config exactly.
- **pepper**: Used `@black pepper{}` to match the `black pepper` entry in [spices] rather than the generic `pepper` in [other].
- **beef chuck**: Used `@beef{1%kg}` since "chuck" is a cut/prep descriptor and `beef` already exists in [butcher].
- **lardons**: Genuinely new ingredient — not covered by `bacon`, `ham`, or `pork belly`. Lardons are a distinct French preparation. Should be added to [butcher].
