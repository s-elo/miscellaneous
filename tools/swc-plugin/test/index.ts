import { transform } from '@swc/core';

const content = `foo === bar`;

transform(content, {
  // Some options cannot be specified in .swcrc
  // filename: "input.js",
  sourceMaps: true,
  // Input files are treated as module by default.
  isModule: false,

  // All options below can be configured via .swcrc
  jsc: {
    parser: {
      syntax: 'ecmascript',
    },
    transform: {},
    experimental: {
      plugins: [
        [
          require.resolve('../target/wasm32-wasip1/release/swc_plugin.wasm'),
          {
            replace_str: 'leo',
          },
        ],
      ],
    },
  },
}).then((output) => {
  console.log(output.code);
});
