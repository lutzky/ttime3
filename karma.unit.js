var webpackConfig = require("./webpack.config");

let extra_files = [];

if (process.env.TTIME_THOROUGH) {
  extra_files.push("test_config/thorough.js");
}

let browsers = [];

if (process.env.FIREFOX_HEADLESS) {
  browsers.push("FirefoxHeadless");
}

if (process.env.CHROME_HEADLESS) {
  browsers.push("ChromeHeadless");
}

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["mocha", "chai"],
    files: extra_files.concat(["spec/**/*.ts"]),
    exclude: [],
    preprocessors: { "spec/**/*.ts": ["webpack"] },
    browsers: browsers,
    client: {
      args: process.env.GITHUB_TOKEN
        ? ["--github-token", process.env.GITHUB_TOKEN]
        : [],
    },
    customLaunchers: {
      FirefoxHeadless: {
        base: "Firefox",
        flags: ["-headless"],
      },
    },
    webpack: {
      mode: "development",
      module: webpackConfig().module,
      resolve: webpackConfig().resolve,
    },
    reporters: ["progress"],
    port: 8080,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,
  });
};
