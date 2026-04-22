# Aisle.conf Changes for Pad Thai

## Matched (no changes needed)

| Recipe ingredient | aisle.conf entry | Section |
|---|---|---|
| fish sauce | fish sauce | [chinese] |
| palm sugar | palm sugar | [chinese] |
| lime juice | lime | [veggies] |
| shrimp | shrimp | [fish guy] |
| eggs | eggs | [grocery] |
| green onions | green onions | [chinese] |
| peanuts | peanuts | [chinese] |
| garlic | garlic cloves | [veggies] |
| vegetable oil | oil | [other] |

## Semantic equivalence decisions

- **tamarind paste** -> used `tamarind concentrate` from [chinese]. Tamarind paste and tamarind concentrate are functionally the same product — a processed, ready-to-use tamarind product (as opposed to tamarind pulp which requires soaking and straining).
- **lime juice (1 tbsp)** -> used `lime{1}` from [veggies]. Per the matching guide, lime juice maps to lime. One lime covers both the sauce and the garnish wedge.
- **roasted peanuts, crushed** -> used `peanuts` from [chinese]. "Roasted" and "crushed" are prep, not a distinct ingredient.
- **vegetable oil** -> used `oil` from [other]. Generic cooking oil.

## New entries required

| Ingredient | Section | Entry format | Reason |
|---|---|---|---|
| rice noodles | [chinese] | `rice noodles` | Flat rice stick noodles (pad thai noodles) are distinct from `cellophane rice noodles` (glass noodles made from mung bean starch). Different product entirely. |
| bean sprouts | [veggies] | `bean sprouts` | Mung bean sprouts, the standard bean sprout used in pad thai and most Asian cooking. Distinct from `soy bean sprouts` which are larger, crunchier, and used in different dishes (e.g., Korean kongnamul). |
