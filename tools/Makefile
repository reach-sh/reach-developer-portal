.PHONY: build
build: installed
	NODE_ENV=production node generator.js -t all

installed:
	npm install
	touch $@
