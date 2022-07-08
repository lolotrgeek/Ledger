const { Chain } = require("../chain")
const { data } = require('./data')

// tests that the chains will merge, but resists self merging and duplication

const chain1 = new Chain()

chain1.debug = true

data.forEach(datum => chain1.put(datum))

function get(key) {
    return chain1.blocks.slice().reverse().find(block => block.data.key === key).data
}

let test_find = get("Cyrus Sanders")

console.log(test_find, "Pass:", test_find.value === "No")
// console.log(dedup.length, store.length)

