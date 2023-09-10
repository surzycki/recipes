import { Cookware, Ingredient, Metadata, Step } from "@cooklang/cooklang-ts";

export type Instruction = {
  content: string;
  ingredients?: string;
};

export type Recipe = {
  title: string;
  nationality: string;
  summary?: string;
  instructions?: Instruction[];
  steps: Step[];
  ingredients: Ingredient[];
  cookwares: Cookware[];
  metadata: Metadata;
  [key: string]: any; // Add this line
};

export interface ApiResponseItem {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}
