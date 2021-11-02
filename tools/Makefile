.PHONY: build
build: installed
	node generator.js -t all

installed:
	npm install
	npm run s1
	npm run s2
	npm run s3
	npm run s4
	touch $@
