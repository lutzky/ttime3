var webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    node: {
      fs: 'empty',
    },
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: ['spec/**/*.ts'],
    exclude: [],
    preprocessors: {'spec/**/*.ts': ['webpack']},
    webpack: {
      mode: 'development',
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress'],
    port: 8080,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity
  })
}
