import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const app = readFileSync(join(root, 'src', 'app', 'App.tsx'), 'utf8');
const index = readFileSync(join(root, 'index.html'), 'utf8');

const requiredAppText = [
  'WANGYANMEI',
  '王艳梅',
  '财务主管',
  '151-8043-4859',
  '2541955489@qq.com',
  '均富联合上市服务（深圳）有限公司',
  '2023.06 - 2026.06',
  '江西典炜服饰有限公司',
  '赣州双诚企业服务有限公司',
  '2019.09 - 2020.10',
  '赣州豆豆母婴有限公司',
  '小型财务部统筹能力',
  'AI汇报工作流',
  '财务经验',
  '6年+',
  'h-[60dvh] max-h-[60dvh]',
  'flex-1 min-h-0 overflow-y-auto overscroll-contain',
  'window.requestAnimationFrame(tick)',
  'useAutoScrollOverflow(activeExperience, 24)',
  'stopAutoScroll',
  'target.addEventListener("touchstart", stopAutoScroll',
  'target.addEventListener("wheel", stopAutoScroll',
  'md:pr-6 lg:pr-8',
  'max-w-[92%]',
  'handleMobileExperienceTouchEnd',
  'document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })',
  'mobileExperienceListRef',
  'remainingScroll <= 48',
  'data-mobile-experience-card',
  'isLastCardVisible',
  'target.scrollTop > 32',
  'mobileExperienceReadyForNextRef',
  'mobileExperienceReadyForNextRef.current = true',
  'mobileExperienceReadyAtTouchStartRef',
  'handleMobileExperienceTouchMove',
  'onTouchMoveCapture={handleMobileExperienceTouchMove}',
  'jumpToContactIfReady',
  'deltaY < -10',
  'deltaY < -42',
  'absolute left-[11px] top-0 bottom-0 w-1',
  'flex flex-col gap-3 pl-8 pb-24',
  'desktopDetailHasMore',
  'updateDesktopDetailFade',
  'black_82%,transparent_100%',
  'md:hidden flex-1 min-h-0 w-full relative mb-1 overflow-y-auto hide-scrollbar',
  'bg-gradient-to-b from-white via-white/70 to-transparent',
];

const forbiddenAppText = [
  'ProjectsSection',
  'id: "projects"',
  '项目经历',
  'DENGSHUMING',
  '邓述明',
  'hi@dengshuming.com',
  '153-0790-1581',
  '2023.06 - 2025.XX',
  '2018.09 - 2020.10',
  '中港通国际现代服务业产业园',
  '产业园多主体',
  '>\n            王艳梅\n',
  'black_78%,transparent_100%',
  'window.setInterval',
  'target.scrollBy',
];

const forbiddenFiles = [
  'mmexport1679447948336.jpg',
  'src/imports/image-7.png',
  'src/imports/image-8.png',
  'src/imports/profile-photo-data.ts',
  'src/imports/profile-photo.jpg',
];

const forbiddenRepoText = [
  'DENGSHUMING',
  'DSM.',
  '邓述明',
  'hi@dengshuming.com',
  '153-0790-1581',
  'AI训练师',
  '数据组长',
  '深圳益邦',
  '小红书',
  'Agent轨迹',
];

const ignoredDirs = new Set(['.git', 'dist', 'node_modules']);
const ignoredFiles = new Set([
  'scripts/verify-wangyanmei-content.mjs',
  'preview-desktop.png',
  'preview-mobile.png',
]);

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.yml',
]);

const extensionOf = (path) => {
  const lastDot = path.lastIndexOf('.');
  return lastDot === -1 ? '' : path.slice(lastDot);
};

const collectTextFiles = (dir) => {
  const files = [];

  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;

    const absolute = join(dir, entry);
    const repoPath = relative(root, absolute);
    const stats = statSync(absolute);

    if (stats.isDirectory()) {
      files.push(...collectTextFiles(absolute));
      continue;
    }

    if (ignoredFiles.has(repoPath)) continue;
    if (textExtensions.has(extensionOf(entry))) files.push(absolute);
  }

  return files;
};

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

for (const file of forbiddenFiles) {
  if (existsSync(join(root, file))) {
    throw new Error(`Repository still contains old copied asset: ${file}`);
  }
}

for (const file of collectTextFiles(root)) {
  const content = readFileSync(file, 'utf8');
  const repoPath = relative(root, file);

  for (const text of forbiddenRepoText) {
    if (content.includes(text)) {
      throw new Error(`${repoPath} still contains old site text: ${text}`);
    }
  }
}

if (!index.includes('王艳梅 - 财务主管')) {
  throw new Error('index.html title was not updated for Wang Yanmei.');
}

if (index.includes('邓述明') || index.includes('AI训练师')) {
  throw new Error('index.html still contains the old site metadata.');
}

console.log('Wang Yanmei content checks passed.');
