const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const api = read('src/api/tutor/resume/index.ts');
assert.ok(
  api.includes('createTutorTeacherEntry'),
  'resume API should expose createTutorTeacherEntry',
);
assert.ok(
  api.includes("url: `/tutor/resume/create`") || api.includes("url: '/tutor/resume/create'"),
  'teacher entry API should post to /tutor/resume/create',
);

const view = read('src/views/tutor/resume/index.vue');
assert.ok(
  view.includes("v-hasPermi=\"['tutor:resume:create']\""),
  'resume admin page should guard teacher entry button with tutor:resume:create',
);
assert.ok(view.includes('录入教师'), 'resume admin page should include teacher entry copy');
[
  'mobile',
  'title',
  'cityCode',
  'subjects',
  'teachModes',
  'hourlyPrice',
  'educationLevel',
  'serviceRadiusKm',
  'intro',
].forEach((field) => {
  assert.ok(view.includes(field), `teacher entry form should include ${field}`);
});
assert.ok(
  view.includes('createTutorTeacherEntry'),
  'resume admin page should submit through createTutorTeacherEntry',
);

console.log('tutor teacher entry admin contract ok');
