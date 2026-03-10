#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import resourceManifestData from "../assets/scripts/config/ResourceManifestData.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const assetsRoot = path.join(root, "assets");

const manifestGroups = {
  scene: Object.values(resourceManifestData.scene).flatMap((profile) =>
    profile.suggestedAssets.map((file) => `${profile.textureGroup}${file}`)
  ),
  prefab: Object.values(resourceManifestData.prefab).flatMap((profile) =>
    profile.suggestedSpriteNames.map((file) => `${profile.textureGroup}${file}`)
  ),
  audio: resourceManifestData.audio.suggestedFiles.map((file) => `${resourceManifestData.audio.group}${file}`),
};

const results = Object.entries(manifestGroups).flatMap(([group, files]) =>
  files.map((relativePath) => ({
    group,
    path: relativePath,
    exists: fs.existsSync(path.join(assetsRoot, relativePath)),
  }))
);

const missing = results.filter((item) => !item.exists);

console.log("SoloTowerDefense resource manifest check");
console.log(`Assets root: ${assetsRoot}`);
console.log(`Total expected: ${results.length}`);
console.log(`Missing: ${missing.length}`);

if (missing.length > 0) {
  console.log("");
  console.log("Missing files:");
  for (const item of missing) {
    console.log(` - [${item.group}] ${item.path}`);
  }
  process.exitCode = 1;
}
