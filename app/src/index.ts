import * as fs from "fs";
import { Recipe, Parser } from "@cooklang/cooklang-ts";
import * as path from "path";

const inputFile: string = process.argv[2];
const outputFile: string = process.argv[3];

function parseRecipe(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const parsedRecipe = new Parser().parse(fileContent);

  const fileName = path.basename(filePath, ".cook");
  const filePathParts = filePath.split(path.sep);
  const nationality = filePathParts[filePathParts.length - 2];
  // Replace underscores and hyphens with spaces and capitalize each word to titlize the title
  const title = fileName
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title,
    nationality,
    ingredients: parsedRecipe.ingredients,
    cookwares: parsedRecipe.cookwares,
    metadata: parsedRecipe.metadata,
    steps: parsedRecipe.steps,
  };
}

function generateHtml(recipe: any, outputFile: string) {
  const template = fs.readFileSync(
    path.join(__dirname, "template.html"),
    "utf-8"
  );

  let outputHtml = template;

  // 1. Handle loop replacements
  const loopRegex = /{{ for (\w+) as (\w+) }}([\s\S]*?){{ endfor }}/g;
  let match;
  while ((match = loopRegex.exec(template)) !== null) {
    const loopType = match[1]; // e.g., "ingredients"
    const placeholderName = match[2]; // e.g., "ingredient"
    const contentBlock = match[3];

    if (loopType in recipe) {
      let loopContent = "";
      for (const item of recipe[loopType]) {
        let replacedBlock = contentBlock.trim();
        for (const key in item) {
          const regex = new RegExp(`{{ ${placeholderName}.${key} }}`, "g");
          replacedBlock = replacedBlock.replace(regex, item[key]);
        }
        loopContent += replacedBlock + "\n";
      }
      outputHtml = outputHtml.replace(match[0], loopContent.trim());
    }
  }

  // 2. Handle single replacements
  const placeholderRegex = /{{ (\w+) }}/g;
  while ((match = placeholderRegex.exec(template)) !== null) {
    const placeholder = match[1];
    if (placeholder in recipe) {
      outputHtml = outputHtml.replace(match[0], recipe[placeholder]);
    }
  }

  fs.writeFileSync(outputFile, outputHtml);
}

function preprocessRecipe(recipe: any): any {
  let instructions: { content: string; ingredients?: string }[] = [];
  let ingredientList: string[] = [];

  for (const step of recipe.steps) {
    let instructionText = "";
    for (const item of step) {
      switch (item.type) {
        case "text":
          instructionText += item.value;
          break;
        case "ingredient":
          instructionText += `${item.name}`;
          ingredientList.push(`${item.name}: ${item.quantity} ${item.units}`);
          break;
        case "timer":
          instructionText += `${item.quantity} ${item.units}`;
          break;
      }
    }

    let instruction = { content: instructionText.trim(), ingredients: "" };

    // For the first instruction, append the ingredients list
    if (instructions.length === 0 && ingredientList.length > 0) {
      instruction.ingredients = "[" + ingredientList.join("; ") + "]";
    }

    instructions.push(instruction);
  }

  recipe.instructions = instructions;

  return recipe;
}

if (!inputFile || !outputFile) {
  console.error("Usage: ts-node script.ts <inputFile> <outputFile>");
  process.exit(1);
}

const recipe = parseRecipe(inputFile);
const processedRecipe = preprocessRecipe(recipe);
console.log(processedRecipe.instructions);

generateHtml(processedRecipe, outputFile);
