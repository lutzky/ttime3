#!/bin/bash

set -e

cd "$(dirname $0)"

exec diff -u \
  <(find src/ spec/ -name '*.ts' -exec cat {} \;) \
  <(find src/ spec/ -name '*.ts' -exec node_modules/.bin/clang-format {} \;) \
