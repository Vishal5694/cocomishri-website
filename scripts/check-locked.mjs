import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const lockPath = path.resolve(process.cwd(), "locked-files.json");
if (!fs.existsSync(lockPath)) {
  console.error("LOCKED: locked-files.json is missing. Run npm run lock:approve.");
  process.exit(1);
}

const locked = JSON.parse(fs.readFileSync(lockPath, "utf8"));
let failed = false;

for (const [file, expectedHash] of Object.entries(locked)) {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.error(
      `LOCKED: ${file} changed. Header/Hero is locked. Ask the owner, then run npm run lock:approve.`
    );
    failed = true;
    continue;
  }
  const actualHash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(fullPath))
    .digest("hex");
  if (actualHash !== expectedHash) {
    console.error(
      `LOCKED: ${file} changed. Header/Hero is locked. Ask the owner, then run npm run lock:approve.`
    );
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
