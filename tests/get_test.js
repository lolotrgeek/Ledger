const { Chain } = require("../src/chain")
const { data } = require('./utils/data')

// tests using the chain as a key/vaue store with a custom get function

const chain1 = new Chain()

chain1.debug = true

data.forEach(datum => chain1.put(datum))

function get(key) {
    return chain1.blocks.slice().reverse().find(block => block.data.key === key).data
}

let test_find = get("Cyrus Sanders")

console.log(test_find, "Pass:", test_find.value === "No")
// console.log(dedup.length, store.length)

