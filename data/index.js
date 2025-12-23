import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadAllJson = () => {
  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".json"));

  const result = {};

  for (const file of files) {
    const filePath = path.join(__dirname, file);
    const content = fs.readFileSync(filePath, "utf-8");

    // key = tên file không có .json
    const key = path.basename(file, ".json");

    result[key] = JSON.parse(content);
  }

  return JSON.stringify(result);
};

export default loadAllJson;
