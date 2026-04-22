# Ingredient Matching Notes for Pad Thai

## Matched ingredients (already in aisle.conf)
- `fish sauce` - found in [chinese]
- `palm sugar` - found in [chinese]
- `shrimp` - found in [fish guy]
- `eggs` - found in [grocery] (as `egg|eggs`)
- `green onions` - found in [chinese] (as `green onion|green onions`)
- `peanuts` - found in [chinese]
- `garlic cloves` - found in [veggies] (as `garlic clove|garlic cloves`)
- `lime` - found in [veggies] (as `lime|limes`)

## Unmatched ingredients (need adding to aisle.conf)
- `rice noodles` - closest match is `cellophane rice noodles` in [chinese], but pad thai uses flat dried rice noodles, not cellophane. Suggest adding `rice noodles` to [chinese].
- `tamarind paste` - aisle.conf has `tamarind pulp` and `tamarind concentrate` in [chinese]. Tamarind paste is a different product. Suggest adding `tamarind paste` to [chinese].
- `bean sprouts` - aisle.conf has `soy bean sprouts` in [veggies], but standard bean sprouts (mung bean) are different. Suggest adding `bean sprouts` to [veggies].
- `vegetable oil` - aisle.conf has `oil` in [other] and various specific oils. Suggest adding `vegetable oil` to [other].
- `lime juice` - used as juice from a lime; referenced as a standalone ingredient. Could be matched to `lime|limes` in [veggies] if the recipe used whole limes, but bottled lime juice is a separate product. Suggest adding `lime juice` to [chinese] or [other].
