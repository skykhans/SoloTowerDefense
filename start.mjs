#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectDir = __dirname;
const docFile = path.join(projectDir, "docs", "11-MainScene节点结构说明.md");

function fileExists(targetPath) {
  return !!targetPath && fs.existsSync(targetPath);
}

function findFirstExisting(paths) {
  return paths.find((targetPath) => fileExists(targetPath)) ?? null;
}

function collectCreatorCandidates() {
  const home = os.homedir();
  const envCandidates = [process.env.COCOS_CREATOR_EXE, process.env.COCOS_CREATOR_PATH].filter(Boolean);

  const platformCandidates =
    process.platform === "darwin"
      ? [
          "/Applications/CocosCreator/CocosCreator.app",
          "/Applications/Cocos Creator/CocosCreator.app",
          "/Applications/CocosDashboard.app",
          path.join(home, "Applications", "CocosCreator", "CocosCreator.app"),
          path.join(home, "Applications", "Cocos Creator", "CocosCreator.app"),
        ]
      : process.platform === "win32"
        ? [
            path.join(process.env.ProgramFiles ?? "", "Cocos", "CocosDashboard", "resources", ".editors"),
            path.join(process.env["ProgramFiles(x86)"] ?? "", "Cocos", "CocosDashboard", "resources", ".editors"),
            path.join(process.env.ProgramData ?? "", "cocos", "editors", "Creator"),
            path.join(process.env.LOCALAPPDATA ?? "", "Programs", "CocosCreator"),
            path.join(process.env.LOCALAPPDATA ?? "", "CocosCreator"),
            path.join(home, "AppData", "Local", "Programs", "CocosCreator"),
            path.join(home, "AppData", "Local", "CocosCreator"),
          ]
        : [
            "/opt/CocosCreator/CocosCreator",
            "/usr/local/bin/CocosCreator",
          ];

  return [...envCandidates, ...platformCandidates];
}

function findCreatorPath() {
  const candidates = collectCreatorCandidates();

  for (const candidate of candidates) {
    if (!fileExists(candidate)) {
      continue;
    }

    if (process.platform === "win32" && fs.statSync(candidate).isDirectory()) {
      const found = findCreatorExeRecursively(candidate);
      if (found) {
        return found;
      }
      continue;
    }

    return candidate;
  }

  return null;
}

function findCreatorExeRecursively(rootDir) {
  const pending = [rootDir];
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) {
      continue;
    }

    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name === "CocosCreator.exe") {
        return fullPath;
      }
    }
  }

  return null;
}

function spawnDetached(command, args) {
  const child = spawn(command, args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}

function openPath(targetPath) {
  if (process.platform === "darwin") {
    spawnDetached("open", [targetPath]);
    return;
  }

  if (process.platform === "win32") {
    spawnDetached("cmd", ["/c", "start", "", targetPath]);
    return;
  }

  spawnDetached("xdg-open", [targetPath]);
}

function launchCreator(creatorPath) {
  if (process.platform === "darwin" && creatorPath.endsWith(".app")) {
    spawnDetached("open", ["-a", creatorPath, projectDir]);
    return true;
  }

  if (process.platform === "win32") {
    spawnDetached(creatorPath, ["--path", projectDir]);
    return true;
  }

  if (fileExists(creatorPath)) {
    spawnDetached(creatorPath, ["--path", projectDir]);
    return true;
  }

  return false;
}

const creatorPath = findCreatorPath();

console.log("SoloTowerDefense startup");
console.log(`Project: ${projectDir}`);

if (creatorPath && launchCreator(creatorPath)) {
  console.log("Launching Cocos Creator...");
  console.log(`Cocos Creator: ${creatorPath}`);
} else {
  console.log("Cocos Creator not found.");
  console.log("You can set COCOS_CREATOR_EXE or COCOS_CREATOR_PATH to your Cocos Creator path.");
  console.log("Opening project folder and key document instead.");
  openPath(projectDir);
}

if (fileExists(docFile)) {
  openPath(docFile);
}
