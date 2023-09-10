import { Recipe } from "./types";
import { generateHtml } from "./generateHtml";
import { preprocessRecipe } from "./preprocess";
import { parseRecipe } from "./parsing";
import { callOpenAiApi } from "./callOpenApi";

const inputFile: string = process.argv[2];

if (!inputFile) {
  console.error("Usage: ts-node index.ts <inputFile>");
  process.exit(1);
}

async function main() {
  const recipe: Recipe = parseRecipe(inputFile);
  const processedRecipe = preprocessRecipe(recipe);

  const prompt: string = `Can you give me a paragraph or two summary of what ${processedRecipe.title} is ? make it 30-40 words long`;
  const summary: string | null = await callOpenAiApi(prompt);
  //const summary: string =
  //"Dwaejigogi Bokkeum is a popular Korean dish consisting of stir-fried pork belly. The pork is typically marinated in a soy sauce-based mixture, imbued with flavors of garlic, ginger, and Korean spices. Served with rice and kimchi, this dish offers a well-rounded, spice-balanced meal.";

  processedRecipe.summary = summary ?? "";
  generateHtml(processedRecipe);
}

main();
