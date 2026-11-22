import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

let raw: string;
try {
  raw = readFileSync("POST.json", "utf8");
} catch {
  console.error("error: POST.json not found at repository root");
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error("error: POST.json is not valid JSON");
  process.exit(1);
}

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  console.error("error: POST.json must be a JSON object with a url field");
  process.exit(1);
}

const url = (parsed as Record<string, unknown>).url;
if (typeof url !== "string" || url.length === 0) {
  console.error("error: POST.json url field must be a non-empty string");
  process.exit(1);
}

let parsedUrl: URL;
try {
  parsedUrl = new URL(url);
} catch {
  console.error("error: POST.json url field must be an https URL on x.com");
  process.exit(1);
}

if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "x.com") {
  console.error("error: POST.json url field must be an https URL on x.com");
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/POST.json", raw);
mkdirSync("out", { recursive: true });
writeFileSync("out/POST.json", raw);
