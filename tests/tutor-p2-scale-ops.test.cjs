const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

[
  'src/api/tutor/appointment/index.ts',
  'src/api/tutor/escrow/index.ts',
  'src/api/tutor/recommend/index.ts',
  'src/views/tutor/appointment/index.vue',
  'src/views/tutor/escrow/index.vue',
  'src/views/tutor/recommend/index.vue',
].forEach((file) => assert.ok(exists(file), `${file} should exist for P2 admin operations`));

const dashboardApi = read('src/api/tutor/dashboard/index.ts');
assert.ok(dashboardApi.includes('getTrend'), 'dashboard API should request 7/30 day trends');
assert.ok(dashboardApi.includes('getFunnel'), 'dashboard API should request conversion funnel');

const dashboardView = read('src/views/tutor/dashboard/index.vue');
assert.ok(dashboardView.includes('<Echart'), 'dashboard view should render ECharts');
assert.ok(dashboardView.includes('趋势'), 'dashboard should include trend chart copy');
assert.ok(dashboardView.includes('漏斗'), 'dashboard should include funnel chart copy');
assert.ok(
  dashboardView.includes('}) as EChartsOption'),
  'dashboard ECharts options should follow the local cast pattern used by admin charts'
);

const cityView = read('src/views/tutor/city/index.vue');
assert.ok(cityView.includes('审核 SLA'), 'city admin should expose audit SLA rule');
assert.ok(cityView.includes('默认半径'), 'city admin should expose default radius rule');
assert.ok(cityView.includes('扣分规则'), 'city admin should expose point-cost rule');

console.log('tutor P2 admin scale-ops contract ok');
