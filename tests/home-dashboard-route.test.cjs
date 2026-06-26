const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const remainingRouter = fs.readFileSync(
  path.join(root, 'src/router/modules/remaining.ts'),
  'utf8',
);

assert.match(
  remainingRouter,
  /path:\s*'\/'[\s\S]*?path:\s*'index'/,
  'home route should define the /index child route',
);
assert.match(
  remainingRouter,
  /component:\s*\(\)\s*=>\s*import\('@\/views\/tutor\/dashboard\/index\.vue'\)/,
  'top home route should render the tutor dashboard overview',
);
assert.match(
  remainingRouter,
  /title:\s*t\('router\.home'\)/,
  'top home route should keep the 首页 menu title',
);
assert.match(remainingRouter, /affix:\s*true/, 'top home route should remain affixed');

console.log('home dashboard route contract ok');
