const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  "bin",
  "glb",
  "glb",
  "gltf"
);

module.exports = config;
