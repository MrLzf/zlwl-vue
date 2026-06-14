const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const viteConfig = fs.readFileSync(path.join(root, 'vite.config.ts'), 'utf8');
const vitePlugins = fs.readFileSync(path.join(root, 'build/vite/index.ts'), 'utf8');
const typecheckConfig = fs.readFileSync(path.join(root, 'tsconfig.typecheck.json'), 'utf8');

assert.match(
  pkg.packageManager || '',
  /^pnpm@8\./,
  'packageManager should pin pnpm 8 so corepack does not select an incompatible latest pnpm',
);

assert.match(
  pkg.scripts['ts:check'],
  /node --max_old_space_size=8192 .*node_modules[\\/]vue-tsc[\\/]bin[\\/]vue-tsc\.js --noEmit -p tsconfig\.typecheck\.json/,
  'ts:check should give vue-tsc enough heap for the admin project',
);

assert.match(
  typecheckConfig,
  /src\/views\/tutor\/\*\*\/\*\.vue/,
  'typecheck baseline should cover tutor admin views',
);

assert.match(
  typecheckConfig,
  /skipTemplateCodegen/,
  'typecheck baseline should quarantine legacy Vue template inference debt',
);

assert.doesNotMatch(
  typecheckConfig,
  /src\/types\/\*\*\/\*\.d\.ts|auto-components\.d\.ts/,
  'typecheck baseline should not import the generated component registry and all legacy component debt',
);

assert.match(
  typecheckConfig,
  /src\/types\/auto-imports\.d\.ts/,
  'typecheck baseline should keep auto-import globals for tutor admin scripts',
);

assert.match(
  typecheckConfig,
  /"@\/config\/axios"[\s\S]*types\/typecheck\/axios-shim\.d\.ts/,
  'typecheck baseline should shim axios to avoid importing the full router and legacy pages',
);

assert.match(
  pkg.scripts['build:local'],
  /node --max_old_space_size=8192 .*node_modules[\\/]vite[\\/]bin[\\/]vite\.js build/,
  'build:local should give Vite enough heap for the admin project',
);

assert.match(
  viteConfig,
  /createVitePlugins\(isBuild\)/,
  'vite config should pass build mode into plugin creation',
);

assert.match(
  vitePlugins,
  /export function createVitePlugins\(isBuild = false\)/,
  'vite plugin factory should default to development behavior',
);

assert.match(
  vitePlugins,
  /dts: isBuild \? false : 'src\/types\/auto-imports\.d\.ts'/,
  'auto-import declarations should be generated only outside build mode',
);

assert.match(
  vitePlugins,
  /dts: isBuild \? false : 'src\/types\/auto-components\.d\.ts'/,
  'component declarations should be generated only outside build mode',
);

console.log('tutor admin tooling regression checks passed');
