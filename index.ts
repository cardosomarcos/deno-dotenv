import { readFile, env } from "deno";

interface Variables {
  [name: string]: string;
}

const LINE_BREAK = /\r\n|\n|\r/;
const DECLARATION = /^\s*(\w+)\s*\=\s*(.*)?\s*$/;

export function parse (source: string): Variables {
  const lines = source.split(LINE_BREAK);

  return lines.reduce((vars: Variables, line: string) => {
    if (!DECLARATION.test(line))
      return vars;

    const [ , name, value ] = DECLARATION.exec(line)!;

    if (!value)
      vars[name] = "";
    else if (/^".*"$/.test(value))
      vars[name] = value.replace(/\\n/g, "\n").replace(/^\"(.*)\"$/, "$1");
    else
      vars[name] = value;

    return vars;
  }, {} as Variables);
}

const decoder = new TextDecoder("utf-8");

export default async function dotenv (): Promise<Variables> {
  const file = await readFile(".env");
  const vars = parse(decoder.decode(file));
  return Object.assign(env(), vars);
}
