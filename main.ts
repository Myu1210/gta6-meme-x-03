import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

let rawText: string;
try {
  rawText = readFileSync("POST.json", "utf8");
} catch {
  fail("missing POST.json at repository root");
}

let parsed: unknown;
try {
  parsed = JSON.parse(rawText);
} catch {
  fail("POST.json is not valid JSON");
}

if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  fail("POST.json must be an object with a non-empty url string");
}

const address = (parsed as Record<string, unknown>).url;
if (typeof address !== "string" || address.length === 0) {
  fail("POST.json url must be a non-empty string");
}

let target: URL;
try {
  target = new URL(address);
} catch {
  fail("POST.json url must be a valid https URL on x.com");
}

if (target.protocol !== "https:" || target.hostname !== "x.com") {
  fail("POST.json url must be a valid https URL on x.com");
}

for (const dir of ["/output", "out"]) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/POST.json`, rawText);
}
