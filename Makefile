export PATH := node_modules/.bin:$(PATH)

ALL_TARGETS = test lint clang-format-diff

ifdef TESTLOOP_FIX
	ALL_TARGETS := fix $(ALL_TARGETS)
endif

all: $(ALL_TARGETS)

clang-format-diff:
	./clang-format-diff.sh

lint:
	@# TODO(lutzky): Fix linting
	@echo 'LINTING CURRENTLY INACTIVE'

test:
	mocha -r ts-node/register spec/**/*.spec.ts

test-watch:
	mocha -r ts-node/register \
		--watch --watch-extensions ts \
		spec/**/*.spec.ts

tsc-watch:
	tsc --watch

fix:
	./clang-format-diff.sh fix
	@echo 'LINT FIXING CURRENTLY INACTIVE'

serve-production:
	http-server

karma:
	karma start karma.unit.js

karma_thorough:
	TTIME_THOROUGH=1 karma start karma.unit.js

webpack-dev-server:
	webpack-dev-server

webpack-production:
	webpack --env.production --progress

.PHONY: test lint all fix serve watch
