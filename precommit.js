const { execSync } = require("child_process");
const cracoConfig = require("./craco.config.js");
const fs = require("fs");
// const { isTest } = require("./src/contract/address.js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.production" });
const isTest = getVariableValue("./src/contract/address.ts", "isTest");

function getVariableValue(filePath, variableName) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const regex = new RegExp(
      `(?:const|let|var)\\s+${variableName}\\s*=\\s*([^;]+)`
    );
    const match = content.match(regex);
    return match ? eval(match[1]) : null;
  } catch (error) {
    console.error("Read failed:", error);
    return null;
  }
}

function getCurrentBranch() {
  try {
    return execSync("git branch --show-current").toString().trim();
  } catch (error) {
    console.error("Failed to get branch:", error);
    process.exit(1);
  }
}

function check() {
  const branch = getCurrentBranch();
  // If branch is not main, skip check
  if (branch !== "main") {
    return;
  }

  if (
    cracoConfig?.devServer?.proxy?.["/api"]?.target !==
    "https://api.gaime.fun/api"
  ) {
    console.error("Config error: /api target is not https://api.gaime.fun/api");
    process.exit(1);
  }

  if (process.env.REACT_APP_API_URL !== "https://api.gaime.fun/api/") {
    console.error(
      "Config error: REACT_APP_API_URL is not https://api.gaime.fun/api"
    );
    process.exit(1);
  }

  if (isTest !== false) {
    console.error("Config error: isTest is not false");
    process.exit(1);
  }
}
check();
