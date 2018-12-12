# Contributing to ttime3

We'd love any contribution! If you'd like to report a bug or request a feature, please do so here: https://github.com/lutzky/ttime3/issues

We use github to host code, to track issues and feature requests, as well as accept pull requests.
To propose changes to the codebase, use Pull Requests (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)).

We use [Travis CI](https://travis-ci.org/) to make sure all pull requests pass tests.

## Getting started developing

Requirements: `npm`.

* Run `npm install` first
* Run `make`, it'll perform lint tests and such. Run `./testloop` to get that to automatically run on file changes.
* Run `make fix` to fix code style formatting.
* Run `make webpack-dev-server` to run a local in a window - this will update the generated javascript when files are changed. This does not modify the production output.
* Run `make webpack-production` to update the production version in `dist/`.

## Releasing a version

The `dist` directory holds a minified, no-debug-info version of the webpack. To update it, run `make webpack-production`. Test the output using `make serve-production`.
