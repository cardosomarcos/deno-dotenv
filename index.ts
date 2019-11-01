import { env, readFileSync } from "deno";

/**
 * Variables defined on .env file or environment.
 */
export type DotenvVariables = Record<string, string>;

const LINE_BREAK = /\r\n|\n|\r/;
const DECLARATION = /^\s*(\w+)\s*\=\s*(.*)?\s*$/;

/**
 * Parse the source of a `.env` file into an object with the variables.
 * @example
 * parse('NAME = "Hari Seldon"\nNICK=Seldon');
 * //=> { NAME: 'Hari Seldon', NICK: 'Seldon' }
 * @param source - Source of a `.env` file.
 */
export function parse(source: string): DotenvVariables {
  const lines = source.split(LINE_BREAK);

  return lines.reduce((vars: DotenvVariables, line: string) => {
    if (!DECLARATION.test(line))
      return vars;

    const [, name, value] = DECLARATION.exec(line)!;

    if (!value)
      vars[name] = "";
    else if (/^".*"$/.test(value))
      vars[name] = value.replace(/^\"(.*)\"$/, "$1").replace(/\\n/g, "\n");
    else
      vars[name] = value;

    return vars;
  }, {} as DotenvVariables);
}

const decoder = new TextDecoder("utf-8");

/**
 * Options to change dotenv's default behavior. Like change .env file path.
 */
export interface DotenvOptions {
  path?: string;
}

/**
 * Read `.env` file from project's root. Merge it's variables with environment
 * ones and return it.
 * @example
 * const env = dotenv();
 * db.connect(env.DB_USERNAME, env.DB_PASSWORD);
 */
export default function dotenv({ path = '.env' }: DotenvOptions = {}): DotenvVariables {
  const file = readFileSync(path);
  const vars = parse(decoder.decode(file));
  return Object.assign(env(), vars);
}
