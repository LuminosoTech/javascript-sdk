/**
 * Copyright 2020, Luminoso Tech
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { dependencies } from "./package.json";

const esPluginOptions = {
  exclude: [
    "./dist",
    "./lib/**/*.tests.js",
    "./lib/**/*.tests.ts",
    "./lib/**/*.umdtests.js",
    "./lib/tests",
    "node_modules",
  ],
  include: ["./lib/**/*.ts"],
};

const cjsBundleFor = (platform) => ({
  plugins: [esbuild({ ...esPluginOptions, minify: true }), json()],
  external: [
    "https",
    "http",
    "url",
    "@luminoso/datafile-manager",
    "@luminoso/datafile-manager/lib/EventEmitter",
    "@luminoso/js-sdk-logging",
  ].concat(Object.keys(dependencies || {})),
  input: `lib/index.${platform}.ts`,
  output: {
    exports: "named",
    format: "cjs",
    file: `dist/luminoso.${platform}.min.js`,
    sourcemap: true,
  },
});

const esmBundle = {
  ...cjsBundleFor("browser"),
  output: [
    {
      format: "es",
      file: "dist/luminoso.browser.es.js",
      sourcemap: true,
    },
    {
      format: "es",
      file: "dist/luminoso.browser.es.min.js",
      sourcemap: true,
    },
  ],
};

// const umdBundle = {
//   plugins: [esbuild(esPluginOptions), json()],
//   input: "lib/index.browser.ts",
//   output: [
//     {
//       name: "luminosoSdk",
//       format: "umd",
//       file: "dist/luminoso.browser.umd.js",
//       exports: "named",
//     },
//     {
//       name: "luminosoSdk",
//       format: "umd",
//       file: "dist/luminoso.browser.umd.min.js",
//       exports: "named",
//       plugins: [terser()],
//       sourcemap: true,
//     },
//   ],
// };

const bundles = {
  "cjs-browser": cjsBundleFor("browser"),
  esm: esmBundle,
  // umd: umdBundle,
};

// Collect all --config-* options and return the matching bundle configs
// Builds all bundles if no --config-* option given
//   --config-cjs will build all three cjs-* bundles
//   --config-umd will build only the umd bundle
export default (args) => {
  const patterns = Object.keys(args)
    .filter((arg) => arg.startsWith("config-"))
    .map((arg) => arg.replace(/config-/, ""));

  // default to matching all bundles
  if (!patterns.length) patterns.push(/.*/);

  const bundlesOutput = Object.entries(bundles)
    .filter(([name, config]) => patterns.some((pattern) => name.match(pattern)))
    .map(([name, config]) => config);

  return [
    ...bundlesOutput,
    {
      plugins: [nodeResolve(), dts()],
      input: "lib/index.browser.ts",
      output: {
        file: `types/index.d.ts`,
        format: "es",
      },
    },
  ];
};
