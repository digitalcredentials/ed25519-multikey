import pkg from './package.json' with {type: "json"};
export default [
  {
    input: './lib/index.js',
    output: [
      {
        dir: 'cjs',
        format: 'cjs',
        preserveModules: true
      }
    ],
    external: Object.keys(pkg.dependencies)
  }
];
