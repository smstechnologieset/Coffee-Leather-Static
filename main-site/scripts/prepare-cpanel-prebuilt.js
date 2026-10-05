// scripts/prepare-cpanel-prebuilt.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEPLOY_DIR = path.join(ROOT, "cpanel-prebuilt");

// Folders and files to exclude from the upload bundle
const SKIP = new Set([
  "node_modules",
  ".git",
  ".github",
  "cpanel-deploy",
  "cpanel-deploy.zip",
  "cpanel-source",
  "cpanel-source.zip",
  "cpanel-prebuilt",
  "cpanel-prebuilt.zip",
  "tsconfig.tsbuildinfo",
  "scripts",
]);

function copyDirRecursive(src, dest, skipSet) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (skipSet && skipSet.has(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, skipSet);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("📦 Preparing PRE-BUILT cPanel deployment bundle for main-site...");

// 1. Reset staging directory
if (fs.existsSync(DEPLOY_DIR)) {
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DEPLOY_DIR, { recursive: true });

// 2. Copy project files (including pre-built .next, excluding node_modules)
console.log(" -> Copying project files & pre-built .next directory...");
copyDirRecursive(ROOT, DEPLOY_DIR, SKIP);

// 3. Rename .env.local to .env for production
const envLocal = path.join(DEPLOY_DIR, ".env.local");
const envDest = path.join(DEPLOY_DIR, ".env");
if (fs.existsSync(envLocal)) {
  fs.renameSync(envLocal, envDest);
  console.log(" -> Renamed .env.local to .env");
}

// 4. Ensure root server.js is present
const rootServerJs = path.join(ROOT, "server.js");
if (fs.existsSync(rootServerJs)) {
  fs.copyFileSync(rootServerJs, path.join(DEPLOY_DIR, "server.js"));
  console.log(" -> Copied server.js");
}

// 5. Verify .next directory exists
if (!fs.existsSync(path.join(DEPLOY_DIR, ".next"))) {
  console.error("❌ .next folder not found! Run 'npm run build' locally before running this script.");
  process.exit(1);
}

// 6. Clean standalone directory if Next.js created one
const standaloneDir = path.join(DEPLOY_DIR, ".next", "standalone");
if (fs.existsSync(standaloneDir)) {
  fs.rmSync(standaloneDir, { recursive: true, force: true });
}

console.log("\n✅ Staging bundle ready at:", DEPLOY_DIR);
