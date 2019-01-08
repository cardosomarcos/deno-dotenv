import { removeSync, writeFileSync, env } from "deno";

// @ts-ignore
import dotenv, { parse } from "../index.ts";

// @ts-ignore
import { test, equal } from "https://deno.land/x/testing/mod.ts";

test({
  name: "[API consistence]: Module default exports dotenv function",
  fn () {
    equal(typeof dotenv, "function");
    equal(dotenv.name, "dotenv");
  }
});

test({
  name: "[API consistence]: Module named exports parse function",
  fn () {
    equal(typeof parse, "function");
    equal(parse.name, "parse");
  }
});


function dotenvFrom (content?: string): { [name: string]: string } {
  const encoder = new TextEncoder();
  writeFileSync(".env", encoder.encode(content));
  const vars = dotenv();
  removeSync(".env");
  return vars;
}

test({
  name: "[dotenv function]: Read .env, parse to vars and return it",
  fn () {
    const value = "Hari Seldon";
    const vars = dotenvFrom(`A = "${value}"`);
    equal(vars.A, value);
  }
});

test({
  name: "[dotenv function]: .env vars overwrites environment variables",
  fn () {
    let vars;
    const valueA = "Hari Seldon";
    const valueB = "Stor Gendibal";

    dotenvFrom(`A = "${valueA}"`);

    vars = env();

    equal(vars.A, valueA);
    equal(vars.B, undefined);

    dotenvFrom(`
      A = "${valueB}"
      B = "${valueB}"
    `);

    vars = env();

    equal(vars.A, valueB);
    equal(vars.B, valueB);
  }
});

test({
  name: "[dotenv function]: merges .env vars with environment ones",
  fn () {
    let vars;
    const valueA = "Hari Seldon";
    const valueB = "Stor Gendibal";

    vars = dotenvFrom(`A = "${valueA}"`);

    equal(vars.A, valueA);
    equal(vars.B, undefined);

    vars = dotenvFrom(`B = "${valueB}"`);

    equal(vars.A, valueA);
    equal(vars.B, valueB);
  }
});
