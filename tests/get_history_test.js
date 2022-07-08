const { Chain } = require("../chain")
const { data } = require('./data')

// tests that the chains will merge, but resists self merging and duplication

const chain1 = new Chain()

chain1.debug = true

data.forEach(datum => chain1.put(datum))

function get_history(key) {
    return chain1.blocks.filter(block => block.data.key === key).map(block => block.data)
}

let test_find = get_history("Cyrus Sanders")

console.log(test_find, "Pass:", test_find.length === 2)
// console.log(dedup.length, store.length)

