// maintenance_app/metro.config.js
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, ".."); // repo root

const config = getDefaultConfig(projectRoot);

// Allow Metro to see one level up (handy now that the app lives in a subfolder)
config.watchFolders = [workspaceRoot];

// Make sure Metro resolves deps from the app (and not random parents)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Prevent accidental duplicate module resolution
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
