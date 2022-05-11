/* eslint-disable react-hooks/rules-of-hooks */
const fs = require('fs-extra');
const path = require('path');
const { build } = require('vite');
const pluginGraphql = require('@rollup/plugin-graphql');
const pluginReact = require('@vitejs/plugin-react').default;
const {
  generateTemplate,
} = require('@commercetools-frontend/mc-html-template');
const {
  packageLocation: applicationStaticAssetsPath,
} = require('@commercetools-frontend/assets');
const paths = require('../config/paths');

const DEFAULT_PORT = parseInt(process.env.HTTP_PORT, 10) || 3001;

const execute = async () => {
  // Ensure the `/public` folder exists.
  fs.mkdirSync(paths.appBuild, { recursive: true });

  // Generate `index.html` (template).
  const appEntryPoint = path.relative(paths.appRoot, paths.entryPoint);
  const html = generateTemplate({
    // Define the module entry point (path relative from the `/public` folder).
    // NOTE: that this is different from the development configuration.
    scriptImports: [`<script type="module" src="/${appEntryPoint}"></script>`],
  });
  // Write `index.html` (template) into the `/public` folder.
  fs.writeFileSync(paths.appIndexHtml, html, { encoding: 'utf8' });

  // TODO: allow to pass additional config options.
  // * `define`
  // * `plugins`
  await build({
    configFile: false,
    root: paths.appRoot,
    define: {
      'process.env.DEBUG': JSON.stringify(false),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    build: {
      outDir: 'public',
      assetsDir: '.',
      rollupOptions: {
        // This is necessary to instruct Vite that the `index.html` (template)
        // is located in the `/public` folder.
        // NOTE that after the build, Vite will write the `index.html` (template)
        // at the `/public/public/index.html` location. See `fs.renameSync` below.
        input: paths.appIndexHtml,
      },
    },
    server: {
      port: DEFAULT_PORT,
    },
    plugins: [
      pluginGraphql(),
      pluginReact({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    ],
  });

  // Rename `/public/public/index.html` to `/public/index.html.template`
  fs.renameSync(
    // Because of our custom entry point path (`/public/index.html`),
    // Vite will write the `index.html` to `/public/public/index.html`.
    // We need to move this file to the `/public` folder and rename it
    // to `index.html.template` (as expected by the `compile-html` command).
    path.join(paths.appBuild, 'public/index.html'),
    paths.appIndexHtmlTemplate
  );
  // Clean up nested folder
  fs.rmdirSync(path.join(paths.appBuild, 'public'));

  // Copy public assets
  fs.copySync(
    path.join(applicationStaticAssetsPath, 'html-page'),
    paths.appBuild,
    { dereference: true }
  );
};

execute().catch((error) => {
  if (error && error.message) {
    console.error(error.message);
  }
  process.exit(1);
});