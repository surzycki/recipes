import { Recipe } from "./types";
import * as fs from "fs";
import * as path from "path";

export function generateHtml(recipe: Recipe) {
  const template = fs.readFileSync(
    path.join(__dirname, "template.html"),
    "utf-8"
  );

  let outputHtml = handleLoopReplacements(template, recipe);
  outputHtml = handleSingleReplacements(outputHtml, recipe);

  // Take the recipe title, downcase and replace spaces with underscore
  const downcasedTitle = recipe.title.toLowerCase().replace(/ /g, "_");
  const outputPath = path.join(
    __dirname,
    "..",
    "dist",
    `${downcasedTitle}.html`
  );

  // If dist directory doesn't exist, create it
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  // Write the output HTML to the new file path
  fs.writeFileSync(outputPath, outputHtml);
}

function handleLoopReplacements(template: string, recipe: Recipe): string {
  const loopRegex = /{{ for (\w+) as (\w+) }}([\s\S]*?){{ endfor }}/g;
  let match;
  let outputHtml = template;

  while ((match = loopRegex.exec(template)) !== null) {
    let loopContent = "";
    const loopArray = recipe[match[1]];

    if (loopArray != undefined) {
      for (const item of loopArray) {
        let replacedBlock = match[3].trim();
        for (const key in item) {
          const regex = new RegExp(`{{ ${match[2]}.${key} }}`, "g");
          replacedBlock = replacedBlock.replace(
            regex,
            (item as { [key: string]: any })[key]
          );
        }
        loopContent += replacedBlock + "\n";
      }
    }
    outputHtml = outputHtml.replace(match[0], loopContent.trim());
  }

  return outputHtml;
}

function handleSingleReplacements(template: string, recipe: Recipe): string {
  const placeholderRegex = /{{ (\w+) }}/g;
  let match;
  let outputHtml = template;

  while ((match = placeholderRegex.exec(template)) !== null) {
    if (match[1] in recipe) {
      outputHtml = outputHtml.replace(match[0], recipe[match[1]]);
    }
  }

  return outputHtml;
}
