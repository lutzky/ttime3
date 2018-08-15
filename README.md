# ttime3 [![Build Status](https://travis-ci.org/lutzky/ttime3.svg?branch=master)](https://travis-ci.org/lutzky/ttime3)

Yet another rewrite of ttime. This version reads JSON files as exported by https://github.com/lutzky/repy, and uses web workers to perform heavy computations in the background.

## Dev notes

* Run `npm install` first
* Run `make`, it'll perform lint tests and such. Run `./testloop` to get that to automatically run on file changes.
* Run `make fix` to fix formatting
* Run `make serve` to run a local server. Opening `index.html` directly in the browser won't work because XHR is used.

Powered by [![VanillaJS](http://vanilla-js.com/assets/button.png)](http://vanilla-js.com)
