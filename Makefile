setup:
	deno --types > deno.d.ts
test:
	deno index.spec.ts --allow-write --allow-env
