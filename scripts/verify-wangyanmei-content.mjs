import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const app = readFileSync(join(root, 'src', 'app', 'App.tsx'), 'utf8');
const index = readFileSync(join(root, 'index.html'), 'utf8');

const requiredAppText = [
  'WANGYANMEI',
  '王艳梅',
  '财务主管',
  '151-8043-4859',
  '2541955489@qq.com',
  '中港通国际现代服务业产业园',
  '江西典炜服饰有限公司',
  '赣州双诚企业服务有限公司',
  '赣州豆豆母婴有限公司',
];

const forbiddenAppText = [
  'ProjectsSection',
  'id: "projects"',
  '项目经历',
  'DENGSHUMING',
  '邓述明',
  'hi@dengshuming.com',
  '153-0790-1581',
];

for (const text of requiredAppText) {
  if (!app.includes(text)) {
    throw new Error(`src/app/App.tsx is missing required text: ${text}`);
  }
}

for (const text of forbiddenAppText) {
  if (app.includes(text)) {
    throw new Error(`src/app/App.tsx still contains old or removed text: ${text}`);
  }
}

if (!index.includes('王艳梅 - 财务主管')) {
  throw new Error('index.html title was not updated for Wang Yanmei.');
}

if (index.includes('邓述明') || index.includes('AI训练师')) {
  throw new Error('index.html still contains the old site metadata.');
}

console.log('Wang Yanmei content checks passed.');
