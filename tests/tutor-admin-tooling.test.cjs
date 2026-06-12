const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

assert.match(
  pkg.packageManager || '',
  /^pnpm@8\./,
  'packageManager should pin pnpm 8 so corepack does not select an incompatible latest pnpm',
);

assert.match(
  pkg.scripts['ts:check'],
  /node --max_old_space_size=8192 .*node_modules[\\/]vue-tsc[\\/]bin[\\/]vue-tsc\.js --noEmit/,
  'ts:check should give vue-tsc enough heap for the admin project',
);

console.log('tutor admin tooling regression checks passed');
