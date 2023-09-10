import { Instruction, Recipe } from "./types";

export function preprocessRecipe(recipe: Recipe): Recipe {
  let instructions: Instruction[] = [];

  for (const step of recipe.steps) {
    let instructionText = "";
    let ingredientList: string[] = [];

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
        case "cookware":
          instructionText += `${item.name}`;
          break;
      }
    }

    let instruction: Instruction = { content: instructionText.trim() };

    if (ingredientList.length > 0) {
      instruction.ingredients = "[" + ingredientList.join("; ") + "]";
    } else {
      instruction.ingredients = "";
    }

    instructions.push(instruction);
  }

  recipe.instructions = instructions;

  return recipe;
}
