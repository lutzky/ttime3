#!/bin/bash

set -e

cd "$(dirname $0)"

if [[ $1 == "fix" ]]; then
  node_modules/.bin/clang-format -i $(find src/ spec/ -name '*.ts')
fi

exec diff -u \
  <(find src/ spec/ -name '*.ts' -exec cat {} \;) \
  <(find src/ spec/ -name '*.ts' -exec node_modules/.bin/clang-format {} \;) \
