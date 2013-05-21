docs:
	npm install -g docco-husky
	docco-husky ./index.js
test:
	./node_modules/.bin/mocha \
	--reporter list test/*.js

test-app:
	cd test/test-app; \
	cp ../../index.js ./lib; \
	st delete -n > /dev/null 2>&1 || true ;\
	st push -n

 .PHONY: test test-app docs
