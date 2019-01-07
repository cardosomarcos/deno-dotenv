# deno-dotenv

## Usage

```ts
import dotenv from "https://raw.githubusercontent.com/cardosomarcos/deno-dotenv/master/index.ts";

const env = dotenv();

console.log({ username: env.DB_USERNAME });
```

### Contribution F.A.Q

#### How to resolve `Cannot find module 'deno'.`?

Generate deno type definitions with the command bellow.

```sh
make setup
```
