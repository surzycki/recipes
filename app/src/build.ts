import { Parser } from "@cooklang/cooklang-ts";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Ingredient = {
  name: string;
  quantity: string;
  units: string;
};

type Instruction = {
  content: string;
  ingredients: string[];
};

type Recipe = {
  slug: string;
  title: string;
  cuisine: string;
  cuisineSlug: string;
  metadata: Record<string, string>;
  ingredients: Ingredient[];
  instructions: Instruction[];
};

type CuisineGroup = {
  name: string;
  slug: string;
  recipes: Recipe[];
};

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATE_DIR = path.join(__dirname, "..", "templates");
const OUT_DIR = path.join(REPO_ROOT, "docs");

// Dirs to skip
const SKIP_DIRS = new Set(["app", "config", "node_modules", ".git", ".github", "docs"]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function titleCase(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function cuisineDisplayName(slug: string): string {
  const overrides: Record<string, string> = {
    "middle-eastern": "Middle Eastern",
    "hot-sauces": "Hot Sauces",
    brazillian: "Brazilian",
    bali: "Balinese",
    apero: "Apéro",
    ottolenghi: "Ottolenghi",
  };
  return overrides[slug] || titleCase(slug);
}

// ---------------------------------------------------------------------------
// Parse a single .cook file
// ---------------------------------------------------------------------------

function parseRecipe(filePath: string): Recipe {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = new Parser().parse(raw);

  const fileName = path.basename(filePath, ".cook");
  const cuisineSlug = path.basename(path.dirname(filePath));

  // Build ingredients list (deduplicated by name)
  const seen = new Map<string, Ingredient>();
  for (const ing of parsed.ingredients) {
    const key = ing.name.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, {
        name: ing.name,
        quantity: String(ing.quantity ?? ""),
        units: ing.units ?? "",
      });
    }
  }

  // Build instructions
  const instructions: Instruction[] = [];
  for (const step of parsed.steps) {
    let text = "";
    const stepIngredients: string[] = [];
    for (const item of step) {
      switch (item.type) {
        case "text":
          text += item.value;
          break;
        case "ingredient":
          text += item.name;
          stepIngredients.push(item.name);
          break;
        case "timer":
          text += `${item.quantity} ${item.units}`;
          break;
        case "cookware":
          text += item.name;
          break;
      }
    }
    const trimmed = text.trim();
    if (trimmed) {
      instructions.push({ content: trimmed, ingredients: stepIngredients });
    }
  }

  return {
    slug: fileName,
    title: parsed.metadata.title || titleCase(fileName),
    cuisine: cuisineDisplayName(cuisineSlug),
    cuisineSlug,
    metadata: parsed.metadata,
    ingredients: Array.from(seen.values()),
    instructions,
  };
}

// ---------------------------------------------------------------------------
// Discover all .cook files
// ---------------------------------------------------------------------------

function discoverRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  const entries = fs.readdirSync(REPO_ROOT, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name) || entry.name.startsWith(".")) continue;
    const dirPath = path.join(REPO_ROOT, entry.name);
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".cook"));
    for (const file of files) {
      try {
        recipes.push(parseRecipe(path.join(dirPath, file)));
      } catch (e) {
        console.warn(`⚠ Skipping ${entry.name}/${file}: ${(e as Error).message}`);
      }
    }
  }

  return recipes;
}

// ---------------------------------------------------------------------------
// Group by cuisine
// ---------------------------------------------------------------------------

function groupByCuisine(recipes: Recipe[]): CuisineGroup[] {
  const map = new Map<string, CuisineGroup>();
  for (const r of recipes) {
    if (!map.has(r.cuisineSlug)) {
      map.set(r.cuisineSlug, { name: r.cuisine, slug: r.cuisineSlug, recipes: [] });
    }
    map.get(r.cuisineSlug)!.recipes.push(r);
  }

  // Sort cuisines alphabetically, recipes alphabetically within
  const groups = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  for (const g of groups) {
    g.recipes.sort((a, b) => a.title.localeCompare(b.title));
  }
  return groups;
}

// ---------------------------------------------------------------------------
// HTML generation
// ---------------------------------------------------------------------------

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderRecipePage(recipe: Recipe, css: string): string {
  const template = fs.readFileSync(path.join(TEMPLATE_DIR, "recipe.html"), "utf-8");

  const ingredientRows = recipe.ingredients
    .map((ing) => {
      const qty = ing.quantity && ing.quantity !== "0" ? escapeHtml(ing.quantity) : "";
      const unit = escapeHtml(ing.units);
      const measure = [qty, unit].filter(Boolean).join(" ");
      return `<tr><td class="measure">${measure}</td><td class="ing-name">${escapeHtml(ing.name)}</td></tr>`;
    })
    .join("\n");

  const steps = recipe.instructions
    .map((inst, i) => {
      // Highlight ingredient names in the step text
      let html = escapeHtml(inst.content);
      for (const ingName of inst.ingredients) {
        const escaped = escapeHtml(ingName);
        html = html.replace(
          new RegExp(`\\b${escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "gi"),
          `<span class="ing-highlight">${escaped}</span>`
        );
      }
      return `<div class="step"><span class="step-num">${i + 1}</span><p>${html}</p></div>`;
    })
    .join("\n");

  const metaPills: string[] = [];
  if (recipe.metadata["time required"]) metaPills.push(`<span class="pill">⏱ ${escapeHtml(recipe.metadata["time required"])}</span>`);
  if (recipe.metadata.serves) metaPills.push(`<span class="pill">👤 ${escapeHtml(recipe.metadata.serves)} servings</span>`);
  if (recipe.metadata.course) metaPills.push(`<span class="pill">${escapeHtml(titleCase(recipe.metadata.course))}</span>`);

  const sourceHtml = recipe.metadata.source
    ? `<a href="${escapeHtml(recipe.metadata.source)}" class="source-link" target="_blank" rel="noopener">View source →</a>`
    : "";

  return template
    .replace(/\{\{title\}\}/g, escapeHtml(recipe.title))
    .replace(/\{\{cuisine\}\}/g, escapeHtml(recipe.cuisine))
    .replace(/\{\{cuisineSlug\}\}/g, escapeHtml(recipe.cuisineSlug))
    .replace(/\{\{metaPills\}\}/g, metaPills.join("\n"))
    .replace(/\{\{ingredients\}\}/g, ingredientRows)
    .replace(/\{\{steps\}\}/g, steps)
    .replace(/\{\{source\}\}/g, sourceHtml)
    .replace(/\{\{css\}\}/g, css);
}

function renderIndexPage(groups: CuisineGroup[], totalCount: number, css: string): string {
  const template = fs.readFileSync(path.join(TEMPLATE_DIR, "index.html"), "utf-8");

  // Cuisine sections
  const sections = groups
    .map((g) => {
      const cards = g.recipes
        .map((r) => {
          const course = r.metadata.course ? `<span class="card-tag">${escapeHtml(titleCase(r.metadata.course))}</span>` : "";
          const time = r.metadata["time required"] ? `<span class="card-time">⏱ ${escapeHtml(r.metadata["time required"])}</span>` : "";
          const ingCount = r.ingredients.length;
          return `<a href="${g.slug}/${r.slug}.html" class="recipe-card">
  <div class="card-body">
    <h3>${escapeHtml(r.title)}</h3>
    <div class="card-meta">${course}${time}<span class="card-ing">${ingCount} ingredients</span></div>
  </div>
</a>`;
        })
        .join("\n");

      return `<section id="${g.slug}" class="cuisine-section">
  <div class="section-header">
    <h2>${escapeHtml(g.name)}</h2>
    <span class="section-count">${g.recipes.length} recipe${g.recipes.length !== 1 ? "s" : ""}</span>
  </div>
  <div class="recipe-grid">${cards}</div>
</section>`;
    })
    .join("\n");

  return template
    .replace(/\{\{sections\}\}/g, sections)
    .replace(/\{\{totalCount\}\}/g, String(totalCount))
    .replace(/\{\{cuisineCount\}\}/g, String(groups.length))
    .replace(/\{\{css\}\}/g, css);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log("🍳 Building recipe site...\n");

  const recipes = discoverRecipes();
  console.log(`  Found ${recipes.length} recipes`);

  const groups = groupByCuisine(recipes);
  console.log(`  Across ${groups.length} cuisines\n`);

  // Load CSS
  const css = fs.readFileSync(path.join(TEMPLATE_DIR, "style.css"), "utf-8");

  // Clean output
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Generate recipe pages
  let count = 0;
  for (const group of groups) {
    const groupDir = path.join(OUT_DIR, group.slug);
    fs.mkdirSync(groupDir, { recursive: true });
    for (const recipe of group.recipes) {
      const html = renderRecipePage(recipe, css);
      fs.writeFileSync(path.join(groupDir, `${recipe.slug}.html`), html);
      count++;
    }
  }
  console.log(`  Generated ${count} recipe pages`);

  // Generate index
  const indexHtml = renderIndexPage(groups, recipes.length, css);
  fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexHtml);
  console.log(`  Generated index.html`);

  console.log(`\n✅ Site built to docs/`);
}

main();
