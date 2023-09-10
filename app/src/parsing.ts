import { Parser } from "@cooklang/cooklang-ts";
import { Recipe } from "./types";
import * as fs from "fs";
import * as path from "path";

export function parseRecipe(filePath: string): Recipe {
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
