"use strict";
// Import the 'path' module to get the absolute path of the .env file
import path from "node:path";
const __dirname = import.meta.url;
console.log(__dirname);

/** Get the absolute path of the .env file. */
const envFilePath = path.resolve(__dirname, "..", ".env");

console.log(envFilePath);

// Load environment variables from the .env file
import dotenv from "dotenv";
dotenv.config({ path: envFilePath });

/** Server port */
export const PORT = process.env.PORT;
console.log(PORT);
/** Server host */
export const HOST = process.env.HOST;
/** Database URL */
export const DB_URL = process.env.DB_URL;
console.log(DB_URL);
/** Access token secret */
export const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
/** Refresh token secret */
export const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;
