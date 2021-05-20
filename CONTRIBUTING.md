# Contributing to ttime3

We'd love any contribution! If you'd like to report a bug or request a feature, please do so here: https://github.com/lutzky/ttime3/issues

We use github to host code, to track issues and feature requests, as well as accept pull requests.
To propose changes to the codebase, use Pull Requests (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)).

We use Github Actions to make sure all pull requests pass tests.

## Getting started developing

Requirements: `npm`.

- Run `npm install` first
- Run `npm test` for all tests, or `npm run test:watch` to automatically rerun tests on file changes.
- Run `npm run format:fix` to fix code style formatting.
- Run `npm start` to run a local in a window - this will update the generated javascript when files are changed. This does not modify the production output.
- Run `npm run build` to update the production version in `dist/`.

To enable additional debug logging, add the parameter `?ttime_debug=1` to the URL.

## Releasing a version

The `dist` directory holds a minified, no-debug-info version of the webpack. To update it, run `npm run build`. Test the output using an HTTP server of your choice, or `npm run start:production`.

In the `master` branch, this directory is empty (and gitignore'd). Travis builds and deploys this automatically to the `gh-pages` branch. Other files should be identical in the `gh-pages` branch, but should not take up extra space in the git repository as they'd be represented by the same blob.

If Travis CI is not operating correctly, deploy manually by merging `master` into `gh-pages`, running `npm run build`, and force-adding the files in the `dist` directory.
