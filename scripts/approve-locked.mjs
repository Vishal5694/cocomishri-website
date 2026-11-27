import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const DEFAULT_FILES = [
  "src/lib/header-config.ts",
  "src/lib/hero-v2-config.ts",
  "src/components/header/SiteHeader.tsx",
  "src/components/header/TopBar.tsx",
  "src/components/header/MenuDrawer.tsx",
  "src/components/header/CountrySelector.tsx",
  "src/components/brand/BrandLogo.tsx",
  "src/components/v2/HeroSliderV2.tsx",
];

const lockPath = path.resolve(process.cwd(), "locked-files.json");
let files = DEFAULT_FILES;
if (fs.existsSync(lockPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(lockPath, "utf8"));
    const keys = Object.keys(existing);
    if (keys.length > 0) files = keys;
  } catch {
    // Use DEFAULT_FILES
  }
}

const hashes = {};
for (const file of files) {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing locked file: ${file}`);
    process.exit(1);
  }
  hashes[file] = crypto
    .createHash("sha256")
    .update(fs.readFileSync(fullPath))
    .digest("hex");
}

fs.writeFileSync(lockPath, JSON.stringify(hashes, null, 2) + "\n");
console.log(`Approved ${files.length} locked files in locked-files.json`);
