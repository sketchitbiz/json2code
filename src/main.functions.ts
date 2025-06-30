import fs from "fs";
import path from "path";
import { generateApiFunctions } from "./apiFuctionGenerator";
import clipboard from "clipboardy"; 

const input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../input.json"), "utf-8"));
const items = input.item;

const functionOutput = generateApiFunctions(items, 'Dealer',false);

console.log("✅ Generated API Functions:\n");
console.log(functionOutput);

// fs.writeFileSync("userApi.functions.ts", functionOutput);

clipboard.writeSync(functionOutput);
