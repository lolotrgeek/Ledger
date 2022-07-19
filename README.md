# Ledger
A non-cryptographic key/value distributed ledger.

## Usage

Simple get/put interface.

```
const { Ledger } = require("basic-ledger")

const ledger = new Ledger()

ledger.put("key", "value")

let value = chain.get("key")
// -> "value"

```

## Notes
- may want to integrate chain merges, [here is a rough implementation](https://github.com/lolotrgeek/Chain/blob/networked-merge/main.js)


## Todo
- consider cleanup of stored test chains