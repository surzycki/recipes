# Aisle Configuration Changes Needed

The following ingredients used in this recipe are not currently in `config/aisle.conf` and should be added:

## [butcher]
- `beef chuck` -- currently only `beef` exists; consider adding `beef chuck` as a distinct cut
- `lardons` -- French-style cured pork pieces, not currently listed

## Notes
- `parsely` is used to match the existing spelling in the repo (e.g., blanquette-de-veau.cook and aisle.conf) even though the standard spelling is "parsley"
- `cremini mushrooms` already exists in `[veggies]` as `cremini mushroom|cremini mushrooms`
- `pearl onions` already exists in `[veggies]`
- `red wine` already exists in `[alcohol]`
- `beef stock` already exists in `[grocery]`
- `tomato paste` already exists in `[grocery]`
- All other ingredients (salt, pepper, oil, butter, carrots, celery, onion, garlic cloves, thyme, bay leaves) are already configured
