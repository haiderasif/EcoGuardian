const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Firebase Auth 10.x can be resolved through a different module entry than
// Firebase App when Metro honors package.json exports. That leaves Auth's
// component registry empty at runtime ("Component auth has not been
// registered yet"). Force Metro to use Firebase's compatible React Native
// entry points consistently.
config.resolver.unstable_enablePackageExports = false;
config.resolver.unstable_enableSymlinks = false;

config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  "bin",
  "glb",
  "glb",
  "gltf"
);

module.exports = config;
