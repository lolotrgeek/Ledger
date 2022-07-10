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
