# Chain
A non cryptographic distributed ledeger.

## Usage

Simple get/put interface.

```
const { Chain } = require("basic-chain")

const chain = new Chain()

// insert data onto local chain
let block = chain.put("data")

// retrieve data from local chain
chain.get(block.block_id)


```

Merge two Chains
```
const chain = new Chain()
const chain2 = new Chain()

chain.merge(chain2)

```