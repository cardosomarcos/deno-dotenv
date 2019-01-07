# deno-dotenv

## Usage

```ts
import dotenv from "https://raw.githubusercontent.com/cardosomarcos/deno-dotenv/master/index.ts";

(async () => {
  const vars = await env<{ DB_USERNAME: string; }>();

  console.log({ username: vars.DB_USERNAME });
})();
```

### Contribution F.A.Q

#### How to resolve `Cannot find module 'deno'.`?

Generate deno type definitions with the command bellow.

```sh
make setup
```
