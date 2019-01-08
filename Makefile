setup:
	deno --types > deno.d.ts
test:
	cd test/ && deno index.spec.ts
