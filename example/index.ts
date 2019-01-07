// @ts-ignore
import env from "https://raw.githubusercontent.com/cardosomarcos/deno-dotenv/master/index.ts";

(async () => {
  const vars = await env();
  console.log({ vars })
})();

