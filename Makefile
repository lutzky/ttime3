export PATH := node_modules/.bin:$(PATH)

all: closure test lint

lint:
	eslint *.js jasmine/spec/*.js

test:
	jasmine

closure:
	google-closure-compiler \
		--js='*.js' \
		--externs=externs/externs.js \
		--compilation_level=ADVANCED \
		--checks_only \
		--jscomp_error='*'

.PHONY: test lint closure all
