---
name: cooklang-recipe
description: "Convert any recipe (text, URL, image, or pasted content) into a properly formatted CookLang .cook file. Use this skill whenever the user wants to write a recipe, convert a recipe, add a recipe, create a .cook file, or mentions CookLang. Also trigger when the user pastes what looks like a recipe (ingredient lists, cooking instructions) even without explicitly asking for CookLang conversion."
---

# CookLang Recipe Writer

You convert recipes from any input format into CookLang `.cook` files that follow this repository's conventions exactly. You also ensure every ingredient is accounted for in `config/aisle.conf`.

## Input handling

The user may provide a recipe as:
- Plain text (copy-pasted from a website, a cookbook, or from memory)
- A URL (fetch and extract the recipe)
- An image/screenshot (read and extract)
- A loose description ("make me a chicken tikka recipe")

Extract: dish name, ingredients (with quantities/units), steps, timing, temperature, servings, and source attribution.

## Output: the .cook file

### File location

Place the file in the appropriate cuisine directory under the recipes root. Use kebab-case for the filename: `cuisine/dish-name.cook`

Examples: `japanese/chicken-katsu.cook`, `mexican/carnitas.cook`, `french/duck-confit.cook`

If unsure about the cuisine, ask the user.

### Metadata block

CookLang uses `>> key: value` lines at the top of the file (NOT YAML front matter). Use these keys:

```
>> time required: 3 hours
>> course: main
>> serves: 4
>> source: https://example.com/recipe
```

Standard `course` values: `main`, `side`, `entree`, `desert`, `plat`, `ingredient`, `banchan`

A blank line separates metadata from the recipe steps. No `---` delimiters, no YAML, no tags arrays.

### No sections, comments, or notes

Do NOT use CookLang section markers (`= Section =`, `== Section ==`) or comment headers (`-- Section`). Even for multi-phase recipes (marinade + cooking, tangzhong + dough), just use blank lines between steps. The recipe should flow as a flat sequence of paragraphs — the cook can follow the natural progression without needing section labels.

### Writing the steps

This is the most important part. Follow these rules strictly:

**1. Ingredients are ALWAYS inline with steps, never as a separate list.**

Bad:
```
@chicken thighs{4}
@soy sauce{2%tbsp}
@garlic cloves{3}

Marinate chicken in soy sauce and garlic.
```

Good:
```
Marinate @chicken thighs{4} in @soy sauce{2%tbsp} with @garlic cloves{3}(minced) for ~{2%hours}.
```

**2. Keep steps short and direct — write for an experienced cook.**

A professional chef doesn't need "carefully stir the mixture making sure not to let it stick to the bottom of the pan while maintaining a gentle simmer." Just say: "Stir over low heat, don't let it stick."

- One main action per step (paragraph)
- Skip obvious instructions ("wash your hands", "preheat the oven" can be folded into the step that uses the oven)
- Use imperative voice: "Sear", "Deglaze", "Fold in" — not "You should sear" or "Next, we will sear"
- Keep 2-4 sentences per step max

**3. Ingredient syntax — no underscores, ever.**

```
@ingredient name{quantity%unit}
```

- Multi-word: `@soy sauce{2%tbsp}`, `@chicken thighs{4}`, `@garlic cloves{3}`
- No unit needed: `@eggs{3}`, `@onion{1/2}`
- Pinch/to-taste: `@salt{}`, `@black pepper{}`
- With prep note: `@onion{1}(diced)`, `@ginger{1%inch}(grated)`

**4. ALWAYS use metric units.**

Convert all imperial measurements to metric. No exceptions — even if the source recipe uses cups, ounces, pounds, or Fahrenheit, convert to grams, milliliters, kilograms, liters, and Celsius.

| Unit | Abbreviation |
|---|---|
| tablespoon | tbsp |
| teaspoon | tsp |
| gram | g |
| kilogram | kg |
| milliliter | ml |
| liter | L |

**5. Timers**

Use `~{duration%minutes}` or `~{duration%hours}` inline:

```
Simmer for ~{45%minutes} until reduced by half.
```

**6. Temperatures**

Always Celsius. Write with degree symbol: `180°C`. Convert Fahrenheit to Celsius if the source uses °F.

**7. Cookware**

Use `#cookware{}` for key equipment: `#wok{}`, `#dutch oven{}`, `#cast iron skillet{}`

Only mention cookware that matters for the technique — skip obvious things like "a bowl" or "a spoon."

## Ingredient matching with aisle.conf

This is critical. After writing the recipe, you must reconcile every ingredient against `config/aisle.conf`.

Read `references/aisle-matching.md` for the full matching guide. The key principles:

1. **Read aisle.conf first** before writing the recipe so you use the exact ingredient names from the config
2. **Normalize** — "3 cloves garlic" becomes `@garlic cloves{3}` because that's what aisle.conf has
3. **Same ingredient, different words** — "scallions" = `green onions` in aisle.conf, "coriander leaves" = `cilantro`, juice of a lemon = `@lemon{1}`
4. **Check all sections** — an ingredient might be in an unexpected category (e.g., `coconut milk` is under `[chinese]`, not `[grocery]`)
5. **Only add new entries** if the ingredient is genuinely not represented. Before adding, explicitly verify no existing entry covers it
6. **When adding**, place it in the right section with plural form: `new item|new items`

### Validation checklist (run through this mentally for every recipe)

- [ ] Every `@ingredient{}` in the recipe has a match in aisle.conf
- [ ] No ingredient was "invented" that's actually a variant of an existing one
- [ ] Any new additions to aisle.conf are in the correct section
- [ ] Ingredient names in the recipe match the aisle.conf spelling exactly (e.g., `corriander seeds` not `coriander seeds` — match the conf even if misspelled)

## Workflow

1. Read the user's recipe input
2. Read `config/aisle.conf` to know the current ingredient inventory
3. Determine the cuisine and filename
4. Write the .cook file following all conventions above
5. Check each ingredient against aisle.conf — report any that need to be added
6. If additions are needed, add them to `config/aisle.conf` in the appropriate section
7. Present the final recipe to the user

## Example

Input: "Simple fried rice - cook 2 cups rice, let cool. Fry 3 eggs scrambled, add rice, 2 tbsp soy sauce, 1 tbsp sesame oil, 3 chopped green onions, done"

Output:
```
>> time required: 20 minutes
>> course: main
>> serves: 2

Scramble @eggs{3} in @oil{} in a #wok{} over high heat, break into pieces, set aside.

Add day-old @rice{400%g}(cooked and cooled) to the wok and stir-fry over high heat for ~{3%minutes} until individual grains are separate and slightly toasted.

Return eggs to the wok. Season with @soy sauce{2%tbsp} and @sesame oil{1%tbsp}, toss to combine.

Finish with @green onions{3}(chopped) and serve immediately.
```
