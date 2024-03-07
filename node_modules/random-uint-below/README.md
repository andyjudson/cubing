# `random-uint-below.js`

## Usage

`randomUIntBelow(max)` returns a random non-negative integer less than max `(0 <= output < max)`. `max` must be at most `2^53`.

```ts
import {randomUIntBelow} from "random-uint-below"


console.log(randomUIntBelow(6)); // Generates a uniform random value from [0, 1, 2, 3, 4, 5]
```

Since one of the most comon use cases for this is to select a random element from an array, we also provide a convenience:

```ts
import {randomChoice} from "random-uint-below"

console.log(randomChoice(["vanilla", "strawberry", "peppermint"]))
```

## Requirements

`random-uint-below.js` requires `crypto.getRandomValues`, which is available in:

- All major browsers since 2015: <https://caniuse.com/getrandomvalues>
- `bun` and `deno`
- `node` without a flag since `v19`: <https://nodejs.org/api/webcrypto.html#cryptogetrandomvaluestypedarray>
  - Available in earlier versions with the `--experimental-global-webcrypto` flag.

Builds are only published in ESM (with ES2020 compatibility).

## License

MIT or GPL.
