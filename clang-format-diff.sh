#!/bin/bash

set -e

cd "$(dirname $0)"

if [[ $1 == "fix" ]]; then
  node_modules/.bin/clang-format -i $(find src/ spec/ -name '*.ts')
fi

for file in $(find src/ spec/ -name '*.ts'); do
	diff --label $file --label $file --color -u $file <(node_modules/.bin/clang-format $file)
done
