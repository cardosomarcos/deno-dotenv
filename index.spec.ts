import { removeSync, writeFileSync, env } from "deno";

// @ts-ignore
import dotenv, { parse } from "index.ts";

// @ts-ignore
import { test, assertEqual as equal } from "https://deno.land/x/testing/mod.ts";

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

function dotenvFrom (content?: string, path?: string): { [name: string]: string } {
  const encoder = new TextEncoder();
  writeFileSync(path || '.env', encoder.encode(content));
  const vars = dotenv({ path });
  removeSync(path || '.env');
  return vars;
}

test({
  name: "[dotenv function]: Read .env, parse to vars and return it",
  fn () {
    const value = "Hari Seldon";
    const vars = dotenvFrom(`A1 = "${value}"`);
    equal(vars.A1, value);
  }
});

test({
  name: "[dotenv function]: .env vars overwrites environment variables",
  fn () {
    let vars;
    const valueA = "Hari Seldon";
    const valueB = "Stor Gendibal";

    vars = env();
    vars.A2 = valueA;

    equal(vars.A2, valueA);
    equal(vars.B2, undefined);

    dotenvFrom(`
      A2 = "${valueB}"
      B2 = "${valueB}"
    `);

    vars = env();

    equal(vars.A2, valueB);
    equal(vars.B2, valueB);
  }
});

test({
  name: "[dotenv function]: Merges .env vars with environment ones",
  fn () {
    let vars;
    const valueA = "Hari Seldon";
    const valueB = "Stor Gendibal";

    vars = dotenvFrom(`A3 = "${valueA}"`);

    equal(vars.A3, valueA);
    equal(vars.B3, undefined);

    vars = dotenvFrom(`B3 = "${valueB}"`);

    equal(vars.A3, valueA);
    equal(vars.B3, valueB);
  }
});

test({
  name: "[parse function]: Resolve spaces between var, equals symbol and value",
  fn () {
    const value = "Hari Seldon";
    const vars = parse(`
      A4   =  ${value}
      B4=${value}
          C4\t \t \t=\t  \t"${value}"
    `);
    equal(vars.A4, value);
    equal(vars.B4, value);
    equal(vars.C4, value);
  }
});

test({
  name: "[parse function]: Reads only one var per line",
  fn () {
    const value = "Hari Seldon";
    const vars = parse(`
      A5 = "${value}"; B5 = "${value}"
      C5 = ${value}
      D5 =
      E5 = "
           ${value}"
    `);
    equal(vars.A5, `${value}"; B5 = "${value}`);
    equal(vars.B5, undefined);
    equal(vars.C5, value);
    equal(vars.D5, '');
    equal(vars.E5, '"');
  }
});

test({
  name: "[parse function]: Parses \\n, empty values as empty string and double quotes",
  fn () {
    const vars = parse(`
      A6 = "\\nA\\nE\\nI"
      B6 =
      C6 = "    "
      D6 = \\n
      E6 = "\\n"
      F6 = "
      G6 = { "name": "Hari Seldon" }
    `);
    equal(vars.A6, '\nA\nE\nI');
    equal(vars.B6, '');
    equal(vars.C6, '    ');
    equal(vars.D6, '\\n');
    equal(vars.E6, '\n');
    equal(vars.F6, '"');
    equal(vars.G6, '{ "name": "Hari Seldon" }');
  }
});

test({
  name: "[dotenv's path option]: Change .env file path.",
  fn () {
    let vars;

    vars = dotenvFrom('A7 = A');
    equal(vars.A7, 'A');

    vars = dotenv({ path: './B/.env' });
    equal(vars.A7, 'B');

    vars = dotenv({ path: 'B/C/.env' });
    equal(vars.A7, 'C');

    vars = dotenvFrom('A7 = D', 'OTHER_FILENAME.txt');
    equal(vars.A7, 'D');
  }
});
