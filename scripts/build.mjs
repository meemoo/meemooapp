// Concatenate and minify the app's classic (non-module) scripts.
// Replaces the old Grunt concat + uglify tasks.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {transform} from 'esbuild';

const root = new URL('..', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));

const SOURCES = [
  // Libs
  'libs/underscore.js',
  'libs/backbone.js',
  'libs/backbone.localStorage.js',
  'libs/mousetrap.js',
  'libs/spectrum/spectrum.js',
  'libs/jquery.ui.touch-punch.js',
  'libs/js-expression-eval/parser.js',
  // Before
  'src/plugins/github-api.js',
  // Iframework
  'src/iframework.js',
  'src/iframework-utils.js',
  'src/eventshistory.js',
  'src/local-app.js',
  'src/local-app-view.js',
  'src/graph.js',
  'src/graph-view.js',
  'src/node.js',
  'src/node-view.js',
  'src/node-box.js',
  'src/node-box-view.js',
  'src/node-box-native-view.js',
  'src/node-box-iframe.js',
  'src/node-box-iframe-view.js',
  'src/port.js',
  'src/port-view.js',
  'src/port-in.js',
  'src/port-in-view.js',
  'src/port-out.js',
  'src/port-out-view.js',
  'src/module.js',
  'src/module-view.js',
  'src/edge.js',
  'src/edge-view.js',
  'src/router.js',
  // Nodes (most are loaded dynamically)
  'src/nodes/image.js',
  // Plugins
  'src/plugins/source.js',
  'src/plugins/library.js',
  'src/plugins/images.js',
  // All Iframework loaded
  'src/iframework-last.js',
];

// Output name kept stable; index.html references build/meemoo-iframework.min.js
const OUT = 'build/meemoo-iframework';

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const time = now.toLocaleTimeString('en-US', {timeZoneName: 'short'});
const banner =
  `/*! ${pkg.title} ${pkg.homepage} - v${pkg.version} - ${date} (${time})\n` +
  `* Copyright (c) ${now.getFullYear()} ${pkg.author.name}; Licensed MIT, AGPL. */\n`;

// Like grunt-contrib-concat stripBanners: drop a leading /* */ comment, keep /*! */
const stripBanner = (src) => src.replace(/^\s*\/\*[^!][\s\S]*?\*\/\s*/, '');

const parts = await Promise.all(
  SOURCES.map(async (file) =>
    stripBanner(await readFile(new URL(file, root), 'utf8'))
  )
);
const code = banner + parts.join('\n');

const min = await transform(code, {
  minify: true,
  legalComments: 'none',
  banner: banner.trimEnd(),
  charset: 'utf8',
});

await mkdir(new URL('build', root), {recursive: true});
await writeFile(new URL(`${OUT}.js`, root), code);
await writeFile(new URL(`${OUT}.min.js`, root), min.code);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1) + ' kB';
console.log(`${OUT}.js      ${kb(code)}`);
console.log(`${OUT}.min.js  ${kb(min.code)}`);
