export PATH := node_modules/.bin:$(PATH)

ALL_TARGETS = test lint

ifdef TESTLOOP_FIX
	ALL_TARGETS := fix $(ALL_TARGETS)
endif

all: $(ALL_TARGETS)

lint:
	# TODO(lutzky): Fix linting
	echo 'LINTING CURRENTLY INACTIVE'

test:
	mocha -r ts-node/register spec/**/*.spec.ts

fix:
	# TODO(lutzky): Fix lint fixing
	echo 'LINT FIXING CURRENTLY INACTIVE'

serve:
	http-server

watch:
	webpack --watch

.PHONY: test lint all fix serve watch
