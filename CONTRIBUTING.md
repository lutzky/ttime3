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
- Run `npm start` to run a local in a window - this will update the generated javascript when files are changed. Using `npm run start:production` creates an optimized build more similar to that created by `npm run build`.
- Run `npm run build` to create a production version in `public/` for local testing.

To enable additional debug logging, add the parameter `?ttime_debug=1` to the URL.

## Releasing a version

Pushing a new version to the `master` branch automatically deploys a new version into `gh-pages` using `npm run build`. This creates

The `public` directory holds a minified, no-debug-info version of the webpack. To create it ,manually, run `npm run build`. Test the output using an HTTP server of your choice.

In the `master` branch, this directory is nonexistent (and gitignore'd). Github actions builds and deploys this automatically to the `gh-pages` branch.

If Github Actions is not operating correctly, deploy manually by running `npm run build`, saving the `public` directory elsewhere, and then updating the `gh-pages` branch with its contents.
