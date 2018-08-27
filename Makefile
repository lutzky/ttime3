export PATH := node_modules/.bin:$(PATH)

all: closure test lint

lint:
	eslint *.js jasmine/spec/*.js

test:
	jasmine

closure:
	google-closure-compiler \
		--js='*.js' \
		--js='jasmine/spec/*.js' \
		--externs=externs/externs.js \
		--externs=node_modules/google-closure-compiler/contrib/externs/jasmine-2.0.js \
		--externs=node_modules/google-closure-compiler/contrib/externs/jquery-3.3.js \
		--compilation_level=ADVANCED \
		--checks_only \
		--jscomp_error='*'

fix:
	eslint --fix *.js jasmine/spec/*.js

serve:
	http-server

.PHONY: test lint closure all fix serve
