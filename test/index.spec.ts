// @ts-ignore
import dotenv, { parse } from "../index.ts";

// @ts-ignore
import { test, equal } from "https://deno.land/x/testing/mod.ts";

test({
  name: "[API consistence]: Module default exports dotenv function",
  fn () {
    equal(typeof dotenv, 'function');
    equal(dotenv.name, 'dotenv');
  }
});

test({
  name: "[API consistence]: Module named exports parse function",
  fn () {
    equal(typeof parse, 'function');
    equal(parse.name, 'parse');
  }
});
