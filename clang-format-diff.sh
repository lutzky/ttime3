#!/bin/bash

set -e

cd "$(dirname $0)"

if [[ $(uname -o) == "Android" ]]; then
  # Workaround for termux
  BINARY=/data/data/com.termux/files/usr/bin/clang-format
else
  BINARY=node_modules/.bin/clang-format
fi

if [[ $1 == "fix" ]]; then
  $BINARY -i $(find src/ spec/ -name '*.ts')
fi

for file in $(find src/ spec/ -name '*.ts'); do
	diff --label $file --label $file -u $file <($BINARY $file)
done
