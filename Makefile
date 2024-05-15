install:
		npm ci
lint:
		npx eslint .
develop:
		npx webpack serve
deleted:
		rm -rf dist
build:
		NODE_ENV=production npx webpack