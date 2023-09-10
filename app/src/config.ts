import dotenv from "dotenv";

dotenv.config();

export const OPENAI_API_KEY: string | undefined = process.env.OPENAI_API_KEY;
