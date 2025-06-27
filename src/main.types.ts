import fs from "fs";
import path from "path";
import { generateApiCode } from "./generator";
import clipboard from "clipboardy"; 

const input = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../input.json"), "utf-8"));

const output = generateApiCode(input); // 👈 여기 수정 (input.item ❌)

console.log(output);

clipboard.writeSync(output);

