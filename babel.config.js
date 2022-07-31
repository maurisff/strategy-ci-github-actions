module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    [
      '@babel/preset-typescript',
      { "onlyRemoveTypeImports": true }
    ]
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@middlewares': './src/middlewares',
        '@utils':'./src/utils'
      }
    }],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "babel-plugin-parameter-decorator",
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
