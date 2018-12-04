var webpackConfig = require('./webpack.config');

let extra_files = [];

if (process.env.TTIME_THOROUGH) {
  extra_files.push('test_config/thorough.js');
}

module.exports = function(config) {
  config.set({
    node: {
      fs: 'empty',
    },
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: extra_files.concat(['spec/**/*.ts']),
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
